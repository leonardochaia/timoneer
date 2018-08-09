import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EventEmitter } from 'stream';
import { TerminalMeasures } from '../container-attacher/container-attacher.component';
import { DockerContainerService } from '../docker-container.service';
import { TAB_DATA } from '../../navigation/tab.model';
import { ContainerInfo } from '../../../../node_modules/@types/dockerode';

@Component({
  selector: 'tim-container-attacher-container',
  templateUrl: './container-attacher-container.component.html',
  styleUrls: ['./container-attacher-container.component.scss']
})
export class ContainerAttacherContainerComponent implements OnInit {

  public stream$: Observable<EventEmitter>;

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

  public onResized(measures: TerminalMeasures) {
    this.containerService.resize(this.containerId, {
      w: measures.charWidth,
      h: measures.charHeight
    })
      .subscribe();
  }
}
