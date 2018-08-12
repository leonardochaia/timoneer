import { Injectable, OnDestroy } from '@angular/core';
import { TabService } from './tab.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tab, TabInstanceConfiguration } from './tab.model';

@Injectable()
export class TabStorageService implements OnDestroy {

  private componetDestroyed = new Subject();

  constructor(private tabService: TabService) { }

  public initialize() {
    this.loadTabs();
    this.loadCurrentTab();

    this.tabService.tabAdded
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(() => {
        this.saveTabs();
      });

    this.tabService.tabsRemoved
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(tab => {
        this.saveTabs();
      });

    this.tabService.currentTabChanged
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(() => {
        this.saveCurrentTab();
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  public popTabHistory() {
    const tabHistory = this.getTabHistory();
    if (tabHistory && tabHistory.length) {
      const pop = tabHistory.pop();
      this.saveTabHistory(tabHistory);
      return this.persistantTabToTab(pop);
    }
  }

  public addToTabHistory(tabs: Tab[]) {
    const tabHistory = this.getTabHistory();
    this.saveTabHistory(tabHistory.concat(tabs.map(t => this.tabToPersistantTab(t))));
  }

  private getTabHistory() {
    return this.loadItem<TabInstanceConfiguration[]>('tabHistory') || [];
  }

  private saveTabHistory(tabHistory: TabInstanceConfiguration[]) {
    this.saveItem('tabHistory', tabHistory);
  }

  private loadTabs() {
    let tabs = this.loadItem<TabInstanceConfiguration[]>('tabs') || [];
    tabs = tabs.map(tab => this.persistantTabToTab(tab));
    this.tabService.addTabs(tabs);
  }

  private loadCurrentTab() {
    const possible = this.loadItem<string>('currentTab');
    if (possible) {
      this.tabService.changeCurrentTab(parseInt(possible, 10));
    }
  }

  private saveCurrentTab() {
    this.saveItem('currentTab', this.tabService.currentTab);
  }

  private tabToPersistantTab(tab: Tab) {
    return tab.configuration;
  }

  private persistantTabToTab(persistant: TabInstanceConfiguration) {
    const original = this.tabService.getTabConfiguration(persistant.id);

    // To fix functions which are not stored in JSON.
    return Object.assign({}, original, persistant) as TabInstanceConfiguration;
  }

  private saveTabs() {
    this.saveItem('tabs', this.tabService.tabs.map(t => this.tabToPersistantTab(t)));
  }

  private saveItem(key: string, item: any) {
    sessionStorage.setItem(key, JSON.stringify(item));
  }

  private loadItem<T>(key: string) {
    const json = sessionStorage.getItem(key);
    if (json) {
      return JSON.parse(json) as T;
    }
  }
}
