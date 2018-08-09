import { Component, OnInit, Input } from '@angular/core';
import { Application } from '../application.model';
import { TimoneerTabsService } from '../../navigation/timoneer-tabs.service';

@Component({
  selector: 'tim-application-launch',
  templateUrl: './application-launch.component.html',
  styleUrls: ['./application-launch.component.scss']
})
export class ApplicationLaunchComponent implements OnInit {

  @Input()
  public application: Application;

  constructor(private tabService: TimoneerTabsService) { }

  public ngOnInit() {
  }

  public containerCreated(id: string) {
    this.tabService.attach(id, true);
  }
}
