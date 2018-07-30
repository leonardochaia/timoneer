import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { DaemonService } from '../daemon.service';
import { EventEmitter } from 'stream';

@Component({
  selector: 'tim-container-attacher-container',
  templateUrl: './container-attacher-container.component.html',
  styleUrls: ['./container-attacher-container.component.scss']
})
export class ContainerAttacherContainerComponent implements OnInit, OnDestroy {

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

        this.stream$ = this.daemonService.docker(d => d.getContainer(containerId).attach({
          stream: true,
          hijack: true,
          stdin: true,
          stdout: true,
          stderr: true,
          logs: true
        }));

      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
