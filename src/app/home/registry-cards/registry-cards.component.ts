import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';
import { TabService } from '../../navigation/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-registry-cards',
  templateUrl: './registry-cards.component.html',
  styleUrls: ['./registry-cards.component.scss']
})
export class RegistryCardsComponent implements OnInit {

  public loading: boolean;

  public registries: { name: string, url: string }[];

  constructor(private settingsService: SettingsService,
    private tabService: TabService) { }

  public ngOnInit() {

    this.loading = true;
    this.settingsService.getSettings()
      .subscribe(settings => {
        this.registries = settings.registries
          .filter(r => r.allowsCatalog)
          .map(r => ({
            name: this.settingsService.getRegistryName(r),
            url: r.url
          }));
        this.loading = false;
      });
  }

  public openSettings() {
    this.tabService.add(TimoneerTabs.SETTINGS);
  }

  public openRegistry(registry: string) {
    this.tabService.add(TimoneerTabs.REGISTRY_IMAGES, {
      title: registry,
      params: registry
    });
  }
}
