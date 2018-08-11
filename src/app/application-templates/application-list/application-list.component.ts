import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../application.service';
import { Application } from '../application.model';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {

  constructor(private applicationService: ApplicationService,
    private tabService: TabService) { }

  public get applications$() {
    return this.applicationService.getApplications();
  }

  public ngOnInit() {
  }

  public openAppTab(app: Application) {
    this.tabService.add(TimoneerTabs.APPLICATION_LAUNCH, {
      title: `Launch ${app.title}`,
      params: app
    });
  }

}
