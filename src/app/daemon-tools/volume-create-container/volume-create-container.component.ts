import { Component, OnInit } from '@angular/core';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-volume-create-container',
  templateUrl: './volume-create-container.component.html',
  styleUrls: ['./volume-create-container.component.scss']
})
export class VolumeCreateContainerComponent implements OnInit {

  constructor(private tabService: TabService) { }

  public ngOnInit() {
  }

  public volumeCreated() {
    this.tabService.replaceCurrent(TimoneerTabs.DOCKER_VOLUMES);
  }

}
