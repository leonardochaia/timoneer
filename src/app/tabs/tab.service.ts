import { Injectable, Inject, Optional } from '@angular/core';
import { ITimoneerTab, APPLICATION_TABS } from './tab.model';
import { Subject } from 'rxjs';

@Injectable()
export class TabService {

  public get currentTab() {
    return this.selectedTab;
  }

  public get tabAdded() {
    return this.tabAddedSubject.asObservable();
  }

  public get tabsRemoved() {
    return this.tabsRemovedSubject.asObservable();
  }

  public get currentTabChanged() {
    return this.currentTabChangedSubject.asObservable();
  }

  public tabs: ITimoneerTab[] = [];

  private selectedTab: number;

  private tabAddedSubject = new Subject<ITimoneerTab>();

  private tabsRemovedSubject = new Subject<ITimoneerTab[]>();

  private currentTabChangedSubject = new Subject<number>();

  constructor(
    @Inject(APPLICATION_TABS)
    @Optional()
    private configuredTabs: ITimoneerTab[]) {

    this.configuredTabs = this.configuredTabs || [];
  }

  public add(tabId: string, config?: { title?: string, params?: any, replaceCurrent?: boolean }) {
    const tab = this.getTabConfiguration(tabId);
    if (!tab) {
      throw new Error(`Failed to find tab [${tabId}]`);
    }
    const merged = Object.assign({}, tab, config || {});
    this.addTab(merged);
  }

  public removeTab(tab: ITimoneerTab) {
    this.spliceTab(tab);

    this.tabsRemovedSubject.next([tab]);
  }

  public removeMultipleTabs(tabs: ITimoneerTab[]) {
    for (const tab of tabs) {
      this.spliceTab(tab);
    }
    this.tabsRemovedSubject.next(tabs);
  }

  public removeCurrentTab() {
    this.removeTab(this.tabs[this.currentTab]);
  }

  public removeAllTabs() {
    this.removeMultipleTabs(this.tabs);
  }

  public removeOtherTabs(tab: ITimoneerTab) {
    this.removeMultipleTabs(this.tabs.filter(t => t !== tab));
  }

  public changeCurrentTab(index: number) {
    this.selectedTab = index;
    this.currentTabChangedSubject.next(this.selectedTab);
  }

  public getTabConfiguration(tabId: string) {
    return this.configuredTabs.filter(t => t.id === tabId)[0];
  }

  public addTab(tab: ITimoneerTab) {

    let isNew = true;

    if (tab.replaceCurrent) {
      this.removeCurrentTab();
    }

    if (!tab.multiple) {
      const found = this.tabs.filter(x => x.id === tab.id
        && x.title === tab.title
        && x.params === tab.params)[0];
      if (found) {
        isNew = false;
        tab = found;
      }
    }

    if (isNew) {
      this.tabs.push(tab);
    }

    this.tabAddedSubject.next(tab);

    this.changeCurrentTab(this.tabs.indexOf(tab));

    return tab;
  }

  private spliceTab(tab: ITimoneerTab) {
    const index = this.tabs.indexOf(tab);
    this.tabs.splice(index, 1);
  }
}
