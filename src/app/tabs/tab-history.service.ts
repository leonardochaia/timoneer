import { Injectable, OnDestroy } from '@angular/core';
import { TabService } from './tab.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TabStorageService } from './tab-storage.service';

@Injectable()
export class TabHistoryService implements OnDestroy {

  private componetDestroyed = new Subject();

  constructor(private tabService: TabService,
    private tabStorageService: TabStorageService) { }

  public initialize() {
    this.tabService.tabsRemoved
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(tab => {
        this.tabStorageService.addToTabHistory(tab);
      });
  }

  public openTabFromHistory() {
    const tab = this.tabStorageService.popTabHistory();
    if (tab) {
      this.tabService.addTab(tab);
    }
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
