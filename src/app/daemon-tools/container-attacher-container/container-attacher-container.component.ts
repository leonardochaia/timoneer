import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { EventEmitter } from 'stream';
import { ContainerAttacherComponent } from '../container-attacher/container-attacher.component';
import { DockerContainerService } from '../docker-container.service';
import { TAB_DATA, OnTabAnimationDone } from '../../navigation/tab.model';

@Component({
  selector: 'tim-container-attacher-container',
  templateUrl: './container-attacher-container.component.html',
  styleUrls: ['./container-attacher-container.component.scss']
})
export class ContainerAttacherContainerComponent implements OnInit, OnTabAnimationDone {

  public stream$: Observable<EventEmitter>;

  @ViewChild(ContainerAttacherComponent)
  private attacher: ContainerAttacherComponent;

  constructor(
    @Inject(TAB_DATA)
    public containerId: string,
    private containerService: DockerContainerService) {
  }

  public ngOnInit() {

    this.stream$ = this.containerService.attach(this.containerId, {
      stream: true,
      hijack: true,
      stdin: true,
      stdout: true,
      stderr: true,
      logs: true
    });
  }

  public timTabAnimationDone() {
    this.attacher.onResize();
  }
}
