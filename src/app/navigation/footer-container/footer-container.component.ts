import { Component } from '@angular/core';
import { TimoneerTabsService } from '../timoneer-tabs.service';

@Component({
  selector: 'tim-footer-container',
  templateUrl: './footer-container.component.html',
  styleUrls: ['./footer-container.component.scss']
})
export class FooterContainerComponent {
  constructor(private tabService: TimoneerTabsService) { }

  public openImages() {
    this.tabService.openDockerImages();
  }
}
