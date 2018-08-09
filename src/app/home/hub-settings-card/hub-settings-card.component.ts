import { Component, OnInit } from '@angular/core';
import { DockerRegistrySettings } from '../../settings/settings.model';
import { SettingsService } from '../../settings/settings.service';
import { TimoneerTabsService } from '../../navigation/timoneer-tabs.service';

@Component({
  selector: 'tim-hub-settings-card',
  templateUrl: './hub-settings-card.component.html',
  styleUrls: ['./hub-settings-card.component.scss']
})
export class HubSettingsCardComponent implements OnInit {
  public hubSettings: DockerRegistrySettings;

  public valid: boolean;
  public loading: boolean;

  constructor(private settingsService: SettingsService,
    private tabService: TimoneerTabsService) { }

  public ngOnInit() {
    this.loading = true;
    this.settingsService.getDockerIOSettings()
      .subscribe(hubSettings => {
        this.hubSettings = hubSettings;
        this.loading = false;
        this.valid = hubSettings.username
          && !!hubSettings.username.length;
      });
  }

  public openSettings() {
    this.tabService.openSettings();
  }
}
