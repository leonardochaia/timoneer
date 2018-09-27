import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContainerAttacherComponent } from '../container-attacher/container-attacher.component';
import { TAB_DATA } from '../../tabs/tab.model';
import { DockerContainerService } from '../docker-container.service';
import { EventEmitter } from 'events';

@Component({
  selector: 'tim-container-logs-container',
  templateUrl: './container-logs-container.component.html',
  styleUrls: ['./container-logs-container.component.scss']
})
export class ContainerLogsContainerComponent implements OnInit {

  public stream$: Observable<EventEmitter>;

  @ViewChild(ContainerAttacherComponent)
  private attacher: ContainerAttacherComponent;

  constructor(
    @Inject(TAB_DATA)
    public containerId: string,
    private containerService: DockerContainerService) {
  }

  public ngOnInit() {
    this.stream$ = this.containerService.logs(this.containerId);
  }

  public timTabAnimationDone() {
    this.attacher.onResize();
  }
}
