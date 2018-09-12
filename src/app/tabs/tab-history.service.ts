import { Injectable, OnDestroy } from '@angular/core';
import { TabService } from './tab.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TabStorageService } from './tab-storage.service';

@Injectable()
export class TabHistoryService implements OnDestroy {

  private disposed = new Subject();

  constructor(private tabService: TabService,
    private tabStorageService: TabStorageService) { }

  public initialize() {
    this.tabService.tabsRemoved
      .pipe(takeUntil(this.disposed))
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
    this.disposed.next();
    this.disposed.unsubscribe();
  }
}
