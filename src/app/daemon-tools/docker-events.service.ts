import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { DockerEvent } from 'dockerode';
import { switchMap, takeUntil, startWith, throttle, throttleTime } from 'rxjs/operators';
import { DockerService } from './docker.service';
import { streamToObservable } from './stream-to-observable';
import { ElectronService } from '../electron-tools/electron.service';

@Injectable()
export class DockerEventsService implements OnDestroy {

  protected events = new Map<string, Subject<DockerEvent>>();

  private disposed = new Subject();

  private unbinded = new Subject();

  constructor(private dockerService: DockerService,
    private ngZone: NgZone,
    electron: ElectronService) {

    const monitor = electron.remote.powerMonitor;

    // Bind and unbind when the machine suspends/resumes.
    monitor.on('suspend', () => {
      this.unbindFromDocker();
    });

    monitor.on('resume', () => {
      setTimeout(() => {
        if (!this.unbinded.closed) {
          this.unbindFromDocker();
        }
        this.bindToDocker();
      }, 2000);
    });

    this.bindToDocker();
  }

  public ngOnDestroy() {
    this.disposed.next();
    this.disposed.unsubscribe();
  }

  public bind(event: string) {
    if (this.events.has(event)) {
      return this.events.get(event).asObservable();
    } else {
      const subject = new Subject<DockerEvent>();
      this.events.set(event, subject);
      return subject.asObservable()
        .pipe(throttleTime(500));
    }
  }

  public bindAll(events: string[], type?: string) {
    return combineLatest(events.map(e => this.bind(type ? `${type}.${e}` : e)
      .pipe(startWith(null))));
  }

  private unbindFromDocker() {
    this.unbinded.next();
    this.unbinded.unsubscribe();
  }

  private bindToDocker() {
    this.unbinded = new Subject<any>();
    this.dockerService.docker(d => d.getEvents())
      .pipe(
        switchMap(stream => streamToObservable<Buffer>(stream, this.ngZone)),
        takeUntil(this.disposed),
        takeUntil(this.unbinded),
      )
      .subscribe(chunk => {
        const decoded = JSON.parse(chunk.toString('utf8')) as DockerEvent;
        if (this.events.has(decoded.Action)) {
          this.events.get(decoded.Action).next(decoded);
        }

        const combined = `${decoded.Type}.${decoded.Action}`;
        if (this.events.has(combined)) {
          this.events.get(combined).next(decoded);
        }
      });
  }
}
