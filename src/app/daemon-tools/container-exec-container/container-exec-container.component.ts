import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEmitter } from 'stream';
import { Exec, ContainerInfo } from 'dockerode';
import { TerminalMeasures, ContainerAttacherComponent } from '../container-attacher/container-attacher.component';
import { DockerContainerService } from '../docker-container.service';
import { TAB_DATA, OnTabAnimationDone } from '../../tabs/tab.model';

@Component({
  selector: 'tim-container-exec-container',
  templateUrl: './container-exec-container.component.html',
  styleUrls: ['./container-exec-container.component.scss']
})
export class ContainerExecContainerComponent implements OnInit, OnTabAnimationDone {

  public stream$: Observable<EventEmitter>;

  public get execId() {
    return this.exec && this.exec.id;
  }

  private exec: Exec;

  @ViewChild(ContainerAttacherComponent)
  private attacher: ContainerAttacherComponent;

  constructor(
    @Inject(TAB_DATA)
    public containerId: string,
    private containerService: DockerContainerService) { }

  public ngOnInit() {
    this.stream$ = this.containerService.exec(this.containerId, {
      Cmd: ['bin/sh'],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
    })
      .pipe(
        map(result => {
          this.exec = result.exec;
          return result.socket;
        })
      );
  }

  public onResized(measures: TerminalMeasures) {
    if (this.exec) {
      this.exec.resize({
        w: measures.charWidth,
        h: measures.charHeight
      });
    }
  }

  public timTabAnimationDone(): void {
    this.attacher.onResize();
  }
}
