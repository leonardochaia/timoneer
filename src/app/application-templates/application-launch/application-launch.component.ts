import { Component, Input } from '@angular/core';
import { Application } from '../application.model';
import { TabService } from '../../navigation/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-application-launch',
  templateUrl: './application-launch.component.html',
  styleUrls: ['./application-launch.component.scss']
})
export class ApplicationLaunchComponent {

  @Input()
  public application: Application;

  constructor(private tabService: TabService) { }

  public containerCreated(id: string) {
    this.tabService.add(TimoneerTabs.DOCKER_ATTACH, {
      title: `Attached to ${id.slice(0, 12)}`,
      params: id,
      replaceCurrent: true
    });
  }
}
