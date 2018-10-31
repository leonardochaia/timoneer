import { Component } from '@angular/core';
import { TimCacheService } from '../../tim-cache/tim-cache.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'tim-cache-clear-card',
  templateUrl: './cache-clear-card.component.html',
  styleUrls: ['./cache-clear-card.component.scss']
})
export class CacheClearCardComponent {

  public loading = false;

  constructor(
    private readonly cache: TimCacheService,
    private readonly notification: NotificationService) { }

  public clearCache() {
    this.loading = true;
    this.cache.clear()
      .subscribe(() => {
        this.loading = false;
        this.notification.open('Cache has been cleared');
      }, e => {
        this.loading = false;
        this.notification.open(e.message, null, {
          panelClass: 'tim-bg-warn',
        });
        console.error(e);
      });
  }

}
