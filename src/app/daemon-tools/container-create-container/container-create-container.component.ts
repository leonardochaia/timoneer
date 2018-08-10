import { Component, OnInit, Inject } from '@angular/core';
import { TAB_DATA } from '../../navigation/tab.model';
import { TabService } from '../../navigation/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-container-create-container',
  templateUrl: './container-create-container.component.html',
  styleUrls: ['./container-create-container.component.scss']
})
export class ContainerCreateContainerComponent implements OnInit {

  constructor(
    private tabService: TabService,
    @Inject(TAB_DATA)
    public initialImage: string) { }

  public ngOnInit() {
  }

  public containerCreated(id: string) {
    this.tabService.add(TimoneerTabs.DOCKER_ATTACH, {
      title: `Attached to ${id.slice(0, 12)}`,
      params: id,
    });
  }
}
