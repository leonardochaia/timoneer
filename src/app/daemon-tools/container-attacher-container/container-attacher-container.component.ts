import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map, take } from 'rxjs/operators';
import { EventEmitter } from 'stream';
import { TerminalMeasures } from '../container-attacher/container-attacher.component';
import { DockerContainerService } from '../docker-container.service';

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
    private containerService: DockerContainerService) { }

  public ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        map(m => m.get('containerId')),
        takeUntil(this.componetDestroyed)
      )
      .subscribe(containerId => {
        this.containerId = containerId;

        this.stream$ = this.containerService.attach(this.containerId, {
          stream: true,
          hijack: true,
          stdin: true,
          stdout: true,
          stderr: true,
          logs: true
        });

      });
  }

  public onResized(measures: TerminalMeasures) {
    this.containerService.resize(this.containerId, {
      w: measures.charWidth,
      h: measures.charHeight
    })
      .subscribe();
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
