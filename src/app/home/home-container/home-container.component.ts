import { Component } from '@angular/core';
import { TimoneerTabsService } from '../../navigation/timoneer-tabs.service';

@Component({
  selector: 'tim-home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.scss']
})
export class HomeContainerComponent {

  constructor(private tabService: TimoneerTabsService) { }

  public openApps() {
    this.tabService.openApplications();
  }
}
