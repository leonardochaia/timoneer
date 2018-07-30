import { Injectable, OnDestroy } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { DockerEvent } from 'dockerode';
import { switchMap, takeUntil, startWith } from 'rxjs/operators';
import { DaemonService } from './daemon.service';

@Injectable()
export class DaemonEventsService implements OnDestroy {
  protected dic = new Map<string, Subject<DockerEvent>>();

  private disposed = new Subject();

  constructor(private daemonService: DaemonService) {
    this.daemonService.docker(d => d.getEvents())
      .pipe(
        switchMap(stream => this.daemonService.streamToObservable<Buffer>(stream)),
        takeUntil(this.disposed)
      )
      .subscribe(chunk => {
        const decoded = JSON.parse(chunk.toString('utf8')) as DockerEvent;
        if (this.dic.has(decoded.Action)) {
          this.dic.get(decoded.Action).next(decoded);
        }
      });
  }

  public ngOnDestroy() {
    this.disposed.next();
    this.disposed.unsubscribe();
  }

  public bind(event: string) {
    if (this.dic.has(event)) {
      return this.dic.get(event).asObservable();
    } else {
      const subject = new Subject<DockerEvent>();
      this.dic.set(event, subject);
      return subject.asObservable();
    }
  }

  public bindAll(events: string[]) {
    return combineLatest(events.map(e => this.bind(e).pipe(startWith(null))));
  }
}
