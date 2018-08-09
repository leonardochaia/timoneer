import { Component, Inject } from '@angular/core';
import { Application } from '../application.model';
import { TAB_DATA } from '../../navigation/tab.model';

@Component({
  selector: 'tim-application-launch-container',
  templateUrl: './application-launch-container.component.html',
  styleUrls: ['./application-launch-container.component.scss']
})
export class ApplicationLaunchContainerComponent {
  constructor(
    @Inject(TAB_DATA)
    public application: Application) { }

}
