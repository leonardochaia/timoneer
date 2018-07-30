import { Component } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';
import { timoneerVersion } from '../../../tim-version';

@Component({
  selector: 'tim-sidenav-container',
  templateUrl: './sidenav-container.component.html',
  styleUrls: ['./sidenav-container.component.scss']
})
export class SidenavContainerComponent {

  public get appVersion() {
    return timoneerVersion.version;
  }

  constructor(private settingsService: SettingsService) { }
}
