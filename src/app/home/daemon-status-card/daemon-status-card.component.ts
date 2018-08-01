import { Component, OnInit } from '@angular/core';
import { SystemInfo } from 'dockerode';
import { ApplicationSettings } from '../../settings/settings.model';
import { SettingsService } from '../../settings/settings.service';
import { DockerSystemService } from '../../daemon-tools/docker-system.service';

@Component({
  selector: 'tim-daemon-status-card',
  templateUrl: './daemon-status-card.component.html',
  styleUrls: ['./daemon-status-card.component.scss']
})
export class DaemonStatusCardComponent implements OnInit {

  public loading: boolean;

  public daemonInfo: SystemInfo;
  public daemonRacheable: boolean;
  public daemonError: string;
  public settings: ApplicationSettings;

  constructor(private settingsService: SettingsService,
    private systemService: DockerSystemService) { }

  public ngOnInit() {
    this.settingsService.areDaemonSettingsValid()
      .subscribe(daemonValid => {
        this.daemonRacheable = daemonValid;
        if (!daemonValid) {
          this.daemonError = 'Docker Client configuration is invalid';
        }
      });

    this.settingsService.getSettings()
      .subscribe(settings => {
        this.settings = settings;
      });

    this.loading = true;
    this.systemService.info()
      .subscribe((info) => {
        this.daemonInfo = info;
        this.daemonRacheable = true;
        this.loading = false;
      }, e => {
        this.daemonError = e.message;
        this.daemonRacheable = false;
        this.loading = false;
      });
  }
}
