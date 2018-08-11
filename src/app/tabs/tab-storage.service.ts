import { Injectable, OnDestroy } from '@angular/core';
import { ITimoneerTab } from './tab.model';
import { TabService } from './tab.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface PersistantTab {
  id: string;
  title?: string;
  params?: any;
}

@Injectable()
export class TabStorageService implements OnDestroy {

  private componetDestroyed = new Subject();

  constructor(private tabService: TabService) { }

  public initialize() {
    this.loadState();

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

  public loadState() {
    this.loadTabs();
    this.loadCurrentTab();
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

  public addToTabHistory(tabs: ITimoneerTab[]) {
    const tabHistory = this.getTabHistory();
    this.saveTabHistory(tabHistory.concat(tabs.map(t => this.tabToPersistantTab(t))));
  }

  private getTabHistory() {
    return this.loadItem<PersistantTab[]>('tabHistory') || [];
  }

  private saveTabHistory(tabHistory: PersistantTab[]) {
    this.saveItem('tabHistory', tabHistory);
  }

  private loadTabs() {
    const tabs = this.loadItem<ITimoneerTab[]>('tabs') || [];
    if (tabs) {
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        tabs[i] = this.persistantTabToTab(tab);
      }
    }

    this.tabService.tabs = tabs;
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

  private tabToPersistantTab(tab: ITimoneerTab): PersistantTab {
    return {
      id: tab.id,
      params: tab.params,
      title: tab.title,
    };
  }

  private persistantTabToTab(persistant: PersistantTab) {
    const original = this.tabService.getTabConfiguration(persistant.id);
    return Object.assign({}, original, persistant);
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
