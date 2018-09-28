import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';
import { DockerRegistrySettings } from '../../settings/settings.model';

@Component({
  selector: 'tim-docker-hub-repo-list-container',
  templateUrl: './docker-hub-repo-list-container.component.html',
  styleUrls: ['./docker-hub-repo-list-container.component.scss']
})
export class DockerHubRepoListContainerComponent implements OnInit {
  public hubSettings: DockerRegistrySettings;

  constructor(private settingsService: SettingsService) { }

  public ngOnInit() {
    this.settingsService.getDockerIOSettings()
      .subscribe(hubSettings => {
        this.hubSettings = hubSettings;
      });
  }

}
