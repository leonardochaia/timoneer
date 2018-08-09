import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../application.service';
import { Application } from '../application.model';
import { TabService } from '../../navigation/tab.service';
import { ApplicationLaunchContainerComponent } from '../application-launch-container/application-launch-container.component';

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
    this.tabService.addTab({
      title: `Launch ${app.title}`,
      component: ApplicationLaunchContainerComponent,
      params: app
    });
  }

}
