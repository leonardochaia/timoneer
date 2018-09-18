import { Component, OnInit } from '@angular/core';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-application-list-container',
  templateUrl: './application-list-container.component.html',
  styleUrls: ['./application-list-container.component.scss']
})
export class ApplicationListContainerComponent implements OnInit {

  constructor(private tab: TabService) { }

  public ngOnInit() {
  }

  public editApplications() {
    this.tab.add(TimoneerTabs.APPLICATION_EDIT_LIST);
  }

}
