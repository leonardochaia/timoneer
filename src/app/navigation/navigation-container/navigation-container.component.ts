import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';
import { NotificationService } from '../../shared/notification.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    private router: Router) {

    this.settingsService.areDaemonSettingsValid()
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(valid => {
        this.settingsValid = valid;
        if (!valid) {
          this.notificationService.open('Daemon Configuration is invalid.', 'Fix', {})
            .onAction()
            .subscribe(() => {
              this.router.navigate(['/settings']);
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
