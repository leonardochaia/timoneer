import { Injectable, Inject, Optional } from '@angular/core';
import { ITimoneerTab, APPLICATION_TABS } from './tab.model';

interface PersistantTab {
  id: string;
  title?: string;
  params?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TabService {

  public get currentTab() {
    return this.selectedTab;
  }
  public tabs: ITimoneerTab[] = [];

  private selectedTab: number;

  constructor(
    @Inject(APPLICATION_TABS)
    @Optional()
    private configuredTabs: ITimoneerTab[]) {
    this.configuredTabs = this.configuredTabs || [];
    this.loadTabs();
    this.loadCurrentTab();
  }

  public add(tabId: string, config?: { title?: string, params?: any, replaceCurrent?: boolean }) {
    const tab = this.findTabById(tabId);
    if (!tab) {
      throw new Error(`Failed to find tab [${tabId}]`);
    }
    const merged = Object.assign({}, tab, config || {});
    this.addTab(merged);
  }

  public removeTab(tab: ITimoneerTab) {
    const index = this.tabs.indexOf(tab);
    this.tabs.splice(index, 1);
    this.saveTabs();
    this.addToTabHistory(tab);
  }

  public removeCurrentTab() {
    this.removeTab(this.tabs[this.currentTab]);
  }

  public removeAllTabs() {
    this.tabs = [];
    this.saveTabs();
  }

  public removeOtherTabs(tab: ITimoneerTab) {
    this.tabs = [];
    this.addTab(tab);
    this.saveTabs();
  }

  public changeCurrentTab(index: number) {
    this.selectedTab = index;
    this.saveCurrentTab();
  }

  public openTabFromHistory() {
    const tab = this.popTabHistory();
    if (tab) {
      this.addTab(tab);
    }
  }

  private addTab(tab: ITimoneerTab) {

    let isNew = true;
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

    if (tab.replaceCurrent) {
      this.removeCurrentTab();
    }

    this.changeCurrentTab(this.tabs.indexOf(tab));
    this.saveTabs();

    return tab;
  }

  private findTabById(tabId: string) {
    return this.configuredTabs.filter(t => t.id === tabId)[0];
  }

  private saveCurrentTab() {
    sessionStorage.setItem('currentTab', this.currentTab.toString());
  }

  private loadCurrentTab() {
    const possible = sessionStorage.getItem('currentTab');
    if (possible && possible.length) {
      this.selectedTab = parseInt(possible, 10);
    }
  }

  private getTabHistory() {
    const history = sessionStorage.getItem('tabHistory');
    if (history) {
      return JSON.parse(history) as PersistantTab[];
    } else {
      return [];
    }
  }

  private saveTabHistory(tabHistory: PersistantTab[]) {
    sessionStorage.setItem('tabHistory', JSON.stringify(tabHistory));
  }

  private addToTabHistory(tab: ITimoneerTab) {
    const tabHistory = this.getTabHistory();
    tabHistory.push(this.tabToPersistantTab(tab));
    this.saveTabHistory(tabHistory);
  }

  private popTabHistory() {
    const tabHistory = this.getTabHistory();
    if (tabHistory && tabHistory.length) {
      const pop = tabHistory.pop();
      this.saveTabHistory(tabHistory);
      return this.persistantTabToTab(pop);
    }
  }

  private tabToPersistantTab(tab: ITimoneerTab): PersistantTab {
    return {
      id: tab.id,
      params: tab.params,
      title: tab.title,
    };
  }

  private persistantTabToTab(persistant: PersistantTab) {
    const original = this.findTabById(persistant.id);
    return Object.assign({}, original, persistant);
  }

  private saveTabs() {
    sessionStorage.setItem('tabs', JSON.stringify(this.tabs.map(t => this.tabToPersistantTab(t))));
  }

  private loadTabs() {
    const json = sessionStorage.getItem('tabs');
    if (json) {
      this.tabs = JSON.parse(json);
      for (let i = 0; i < this.tabs.length; i++) {
        const tab = this.tabs[i];
        this.tabs[i] = this.persistantTabToTab(tab);
      }
    } else {
      this.tabs = [];
    }
    return this.tabs;
  }
}
