import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, map } from 'rxjs/operators';
import { EventEmitter } from 'stream';
import { DaemonService } from '../daemon.service';

@Component({
  selector: 'tim-container-exec-container',
  templateUrl: './container-exec-container.component.html',
  styleUrls: ['./container-exec-container.component.scss']
})
export class ContainerExecContainerComponent implements OnInit, OnDestroy {

  public containerId: string;

  public stream$: Observable<EventEmitter>;

  private componetDestroyed = new Subject();

  constructor(private activatedRoute: ActivatedRoute,
    private daemonService: DaemonService) { }

  public ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        map(m => m.get('containerId')),
        takeUntil(this.componetDestroyed)
      )
      .subscribe(containerId => {
        this.containerId = containerId;

        this.stream$ = this.daemonService.exec(containerId);
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
