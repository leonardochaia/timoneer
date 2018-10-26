import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tim-registry-cards',
  templateUrl: './registry-cards.component.html',
  styleUrls: ['./registry-cards.component.scss']
})
export class RegistryCardsComponent implements OnInit, OnDestroy {

  public loading: boolean;

  public registries: { name: string, url: string }[];
  private componetDestroyed = new Subject();

  constructor(private settingsService: SettingsService,
    private tabService: TabService) { }

  public ngOnInit() {

    this.registries = [];
    this.loading = true;
    this.settingsService.getSettings()
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(settings => {
        this.registries = settings.registries
          .filter(r => r.allowsCatalog)
          .map(r => ({
            name: this.settingsService.getRegistryName(r),
            url: r.url,
            username: r.username
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

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
