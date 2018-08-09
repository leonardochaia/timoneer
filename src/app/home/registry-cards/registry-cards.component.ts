import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';
import { TimoneerTabsService } from '../../navigation/timoneer-tabs.service';
import { RegistryListContainerComponent } from '../../registry/registry-list-container/registry-list-container.component';
import { TabService } from '../../navigation/tab.service';

@Component({
  selector: 'tim-registry-cards',
  templateUrl: './registry-cards.component.html',
  styleUrls: ['./registry-cards.component.scss']
})
export class RegistryCardsComponent implements OnInit {

  public loading: boolean;

  public registries: { name: string, url: string }[];

  constructor(private settingsService: SettingsService,
    private tabService: TabService,
    private timoneerTabService: TimoneerTabsService) { }

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
    this.timoneerTabService.openSettings();
  }

  public openRegistry(registry: string) {
    this.tabService.addTab({
      title: registry,
      component: RegistryListContainerComponent,
      params: registry
    });
  }
}
