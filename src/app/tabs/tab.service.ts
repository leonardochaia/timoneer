import { Injectable, Inject, Optional } from '@angular/core';
import { APPLICATION_TABS, TabConfiguration, Tab, TabCreationConfiguration, TabInstanceConfiguration } from './tab.model';
import { Subject } from 'rxjs';

@Injectable()
export class TabService {

  public get currentTab() {
    return this.selectedTab;
  }

  public get tabAdded() {
    return this.tabsAddedSubject.asObservable();
  }

  public get tabsRemoved() {
    return this.tabsRemovedSubject.asObservable();
  }

  public get currentTabChanged() {
    return this.currentTabChangedSubject.asObservable();
  }

  public get tabs() {
    return this.currentTabs;
  }

  private currentTabs: Tab[] = [];

  private selectedTab: number;

  private tabsAddedSubject = new Subject<Tab[]>();

  private tabsRemovedSubject = new Subject<Tab[]>();

  private currentTabChangedSubject = new Subject<number>();

  constructor(
    @Inject(APPLICATION_TABS)
    @Optional()
    private configuredTabs: TabConfiguration[]) {

    this.configuredTabs = this.configuredTabs || [];
  }

  public add(tabId: string, config?: TabCreationConfiguration) {
    const tabConfiguration = this.getTabConfiguration(tabId);
    if (!tabConfiguration) {
      throw new Error(`Failed to find tab [${tabId}]`);
    }
    const merged = Object.assign({}, tabConfiguration, config || {}) as TabInstanceConfiguration;
    return this.addTab(merged);
  }

  public replaceCurrent(tabId: string, config?: TabCreationConfiguration) {
    this.removeCurrentTab();
    return this.add(tabId, config);
  }

  public removeTab(tab: Tab) {
    this.spliceTab(tab);

    this.tabsRemovedSubject.next([tab]);
  }

  public removeMultipleTabs(tabs: Tab[]) {
    for (const tab of tabs) {
      this.spliceTab(tab);
    }
    this.tabsRemovedSubject.next(tabs);
  }

  public removeCurrentTab() {
    this.removeTab(this.tabs[this.currentTab]);
  }

  public removeAllTabs() {
    this.removeMultipleTabs(this.tabs.slice());
  }

  public removeOtherTabs(tab: Tab) {
    this.removeMultipleTabs(this.tabs.filter(t => t !== tab));
  }

  public changeCurrentTab(index: number) {
    this.selectedTab = index;
    this.currentTabChangedSubject.next(this.selectedTab);
  }

  public getTabConfiguration(tabId: string) {
    return this.configuredTabs.filter(t => t.id === tabId)[0];
  }

  public addTab(config: TabInstanceConfiguration) {

    const { tab } = this.addTabInternal(config);

    this.tabsAddedSubject.next([tab]);

    this.changeCurrentTab(this.getTabIndex(tab));

    return tab;
  }

  public addTabs(configs: TabInstanceConfiguration[]) {
    const newTabs: Tab[] = [];
    for (const config of configs) {
      const { created, tab } = this.addTabInternal(config);
      if (created) {
        newTabs.push(tab);
      }
    }

    if (newTabs.length) {

      this.tabsAddedSubject.next(newTabs);

      this.changeCurrentTab(this.getTabIndex(newTabs[newTabs.length - 1]));
    }

    return newTabs;
  }

  private addTabInternal(config: TabInstanceConfiguration) {

    let tab: Tab;
    let created: boolean;

    if (!config.multiple) {
      tab = this.tabs.filter(x => x.compare(config))[0];
      created = false;
    }

    if (!tab) {
      tab = new Tab(config);
      this.tabs.push(tab);
      created = true;
    }

    return { tab, created };
  }

  private getTabIndex(tab: Tab) {
    return this.tabs.indexOf(tab);
  }

  private spliceTab(tab: Tab) {
    const index = this.getTabIndex(tab);
    this.tabs.splice(index, 1);
  }
}
