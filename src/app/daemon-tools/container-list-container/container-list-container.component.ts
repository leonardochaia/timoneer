import { Component } from '@angular/core';
import { TimoneerTabs } from '../../timoneer-tabs';
import { TabService } from '../../tabs/tab.service';

@Component({
  selector: 'tim-container-list-container',
  templateUrl: './container-list-container.component.html',
  styleUrls: ['./container-list-container.component.scss']
})
export class ContainerListContainerComponent {

  constructor(private readonly tab: TabService) { }

  public createContainer() {
    this.tab.add(TimoneerTabs.DOCKER_CONTAINER_NEW);
  }
}
