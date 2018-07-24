import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'tim-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {

  constructor(private applicationService: ApplicationService) { }

  public get applications$() {
    return this.applicationService.getApplications();
  }

  ngOnInit() {
  }

}
