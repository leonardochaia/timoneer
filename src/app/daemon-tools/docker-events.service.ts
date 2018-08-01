import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { DockerEvent } from 'dockerode';
import { switchMap, takeUntil, startWith } from 'rxjs/operators';
import { DockerService } from './docker.service';
import { streamToObservable } from './stream-to-observable';

@Injectable()
export class DockerEventsService implements OnDestroy {

  protected events = new Map<string, Subject<DockerEvent>>();

  private disposed = new Subject();

  constructor(dockerService: DockerService,
    ngZone: NgZone) {

    dockerService.docker(d => d.getEvents())
      .pipe(
        switchMap(stream => streamToObservable<Buffer>(stream, ngZone)),
        takeUntil(this.disposed)
      )
      .subscribe(chunk => {
        const decoded = JSON.parse(chunk.toString('utf8')) as DockerEvent;
        if (this.events.has(decoded.Action)) {
          this.events.get(decoded.Action).next(decoded);
        }
      });
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
      return subject.asObservable();
    }
  }

  public bindAll(events: string[]) {
    return combineLatest(events.map(e => this.bind(e).pipe(startWith(null))));
  }
}
