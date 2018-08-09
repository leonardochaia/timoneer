import { Component, OnInit, Inject } from '@angular/core';
import { TAB_DATA } from '../../navigation/tab.model';
import { TimoneerTabsService } from '../../navigation/timoneer-tabs.service';

@Component({
  selector: 'tim-container-create-container',
  templateUrl: './container-create-container.component.html',
  styleUrls: ['./container-create-container.component.scss']
})
export class ContainerCreateContainerComponent implements OnInit {

  constructor(private tabService: TimoneerTabsService,
    @Inject(TAB_DATA)
    public initialImage: string) { }

  public ngOnInit() {
  }

  public containerCreated(id: string) {
    this.tabService.attach(id, true);
  }
}
