import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SettingsService } from '../../settings/settings.service';
import { TabService } from '../../tabs/tab.service';
import { takeUntil } from 'rxjs/operators';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-registry-config-status',
  templateUrl: './registry-config-status.component.html',
  styleUrls: ['./registry-config-status.component.scss']
})
export class RegistryConfigStatusComponent implements OnInit, OnDestroy {

  public loading: boolean;
  public valid: boolean;

  private componetDestroyed = new Subject();

  constructor(private settingsService: SettingsService,
    private tabService: TabService) { }

  public ngOnInit() {
    this.loading = true;
    this.settingsService.getSettings()
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(settings => {
        this.valid = settings.registries.length > 1;
        this.loading = false;
      });
  }

  public openSettings() {
    this.tabService.add(TimoneerTabs.SETTINGS);
  }

  public openRegistry(registry: string) {
    this.tabService.add(TimoneerTabs.DOCKER_IMAGES);
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
