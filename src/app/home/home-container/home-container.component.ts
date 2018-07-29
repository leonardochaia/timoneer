import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';
import { ApplicationSettings, DockerClientSettings } from '../../settings/settings.model';

@Component({
  selector: 'tim-home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.scss']
})
export class HomeContainerComponent implements OnInit {
  public registries: { name: string, url: string }[];

  constructor(private settingsService: SettingsService) { }

  public ngOnInit() {

    this.settingsService.getSettings()
      .subscribe(settings => {
        this.registries = settings.registries
          .filter(r => r.allowsCatalog)
          .map(r => ({
            name: this.settingsService.getRegistryName(r),
            url: r.url
          }));
      });
  }

}
