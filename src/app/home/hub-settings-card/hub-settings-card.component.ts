import { Component, OnInit } from '@angular/core';
import { DockerRegistrySettings } from '../../settings/settings.model';
import { SettingsService } from '../../settings/settings.service';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

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
    private tabService: TabService) { }

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
    this.tabService.add(TimoneerTabs.SETTINGS);
  }
}
