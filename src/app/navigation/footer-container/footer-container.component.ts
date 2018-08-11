import { Component } from '@angular/core';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-footer-container',
  templateUrl: './footer-container.component.html',
  styleUrls: ['./footer-container.component.scss']
})
export class FooterContainerComponent {
  constructor(private tabService: TabService) { }

  public openImages() {
    this.tabService.add(TimoneerTabs.DOCKER_IMAGES);
  }
}
