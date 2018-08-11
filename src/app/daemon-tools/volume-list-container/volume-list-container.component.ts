import { Component, OnInit } from '@angular/core';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-volume-list-container',
  templateUrl: './volume-list-container.component.html',
  styleUrls: ['./volume-list-container.component.scss']
})
export class VolumeListContainerComponent implements OnInit {

  constructor(private tabService: TabService) { }

  public ngOnInit() {
  }

  public createVolume() {
    this.tabService.add(TimoneerTabs.DOCKER_VOLUME_NEW);
  }

}
