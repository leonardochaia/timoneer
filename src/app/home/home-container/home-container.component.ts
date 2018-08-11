import { Component } from '@angular/core';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.scss']
})
export class HomeContainerComponent {

  constructor(private tabService: TabService) { }

  public openApps() {
    this.tabService.add(TimoneerTabs.APPLICATION_LIST);
  }
}
