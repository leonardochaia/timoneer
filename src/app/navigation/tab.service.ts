import { Injectable, Inject, Optional } from '@angular/core';
import { ITimoneerTab, APPLICATION_TABS } from './tab.model';

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
  }

  public removeCurrentTab() {
    this.tabs.splice(this.currentTab, 1);
    this.saveTabs();
  }

  public removeAllTabs() {
    this.tabs = [];
    this.saveTabs();
  }

  public changeCurrentTab(index: number) {
    this.selectedTab = index;
    this.saveCurrentTab();
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
      this.selectedTab = parseInt(possible);
    }
  }

  private saveTabs() {
    sessionStorage.setItem('tabs', JSON.stringify(this.tabs.map(t => ({
      id: t.id,
      params: t.params,
      title: t.title,
    }))));
  }

  private loadTabs() {
    const json = sessionStorage.getItem('tabs');
    if (json) {
      this.tabs = JSON.parse(json);
      for (let i = 0; i < this.tabs.length; i++) {
        const tab = this.tabs[i];
        const original = this.findTabById(tab.id);
        this.tabs[i] = Object.assign({}, original, tab);
      }
    } else {
      this.tabs = [];
    }
    return this.tabs;
  }
}
