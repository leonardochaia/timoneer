import { Component, OnInit } from '@angular/core';
import { DockerRegistrySettings } from '../../settings/settings.model';
import { SettingsService } from '../../settings/settings.service';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-docker-hub-config-status',
  templateUrl: './docker-hub-config-status.component.html',
  styleUrls: ['./docker-hub-config-status.component.scss']
})
export class DockerHubConfigStatusComponent implements OnInit {
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
