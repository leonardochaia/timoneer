import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../application.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'tim-application-edit-list-container',
  templateUrl: './application-edit-list-container.component.html',
  styleUrls: ['./application-edit-list-container.component.scss']
})
export class ApplicationEditListContainerComponent implements OnInit {

  public json: string;

  constructor(private applications: ApplicationService,
    private notification: NotificationService) { }

  public ngOnInit() {
    this.applications.getApplications()
      .subscribe(apps => {
        this.json = JSON.stringify(apps, null, 2);
      });
  }

  public save() {
    this.applications.saveApplications(this.json)
      .subscribe(() => {
        this.notification.open('Applications saved', null, {
          panelClass: 'tim-bg-primary'
        });
      }, (error) => {
        this.notification.open(error.message, null, {
          panelClass: 'tim-bg-warn'
        });
      });
  }

}
