import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';
import { NotificationService } from '../../shared/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TabService } from '../tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-navigation-container',
  templateUrl: './navigation-container.component.html',
  styleUrls: ['./navigation-container.component.scss']
})
export class NavigationContainerComponent implements OnInit, OnDestroy {

  public settingsValid: boolean;

  private componetDestroyed = new Subject();

  constructor(private settingsService: SettingsService,
    private notificationService: NotificationService,
    private tabService: TabService) {

    this.settingsService.areDaemonSettingsValid()
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(valid => {
        this.settingsValid = valid;
        if (!valid) {
          this.notificationService.open('Daemon Configuration is invalid.', 'Fix', {})
            .onAction()
            .subscribe(() => {
              this.tabService.add(TimoneerTabs.SETTINGS);
            });
        }
      });
  }

  public ngOnInit() {
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
