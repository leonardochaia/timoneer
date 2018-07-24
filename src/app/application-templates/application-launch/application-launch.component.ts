import { Component, OnInit, Input } from '@angular/core';
import { Application } from '../application.model';
import { Router } from '@angular/router';

@Component({
  selector: 'tim-application-launch',
  templateUrl: './application-launch.component.html',
  styleUrls: ['./application-launch.component.scss']
})
export class ApplicationLaunchComponent implements OnInit {

  @Input()
  public application: Application;

  constructor(private router: Router) { }

  public ngOnInit() {
  }

  public containerCreated(id: string) {
    this.router.navigate(['/docker/containers/', id, 'attach']);
  }
}
