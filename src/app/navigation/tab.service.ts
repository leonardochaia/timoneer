import { Injectable, Inject, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { ITimoneerTab, APPLICATION_TABS } from './tab.model';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  public currentTab: number;
  public tabs: ITimoneerTab[] = [];

  public get tabAdded() {
    return this.tabAddedSubject.asObservable();
  }

  private tabAddedSubject = new Subject<ITimoneerTab>();

  constructor(
    @Inject(APPLICATION_TABS)
    @Optional()
    private configuredTabs: ITimoneerTab[]) {
    this.configuredTabs = this.configuredTabs || [];
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
  }

  public removeCurrentTab() {
    this.tabs.splice(this.currentTab, 1);
  }

  public removeAllTabs() {
    this.tabs = [];
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

    this.currentTab = this.tabs.indexOf(tab);
    this.tabAddedSubject.next(tab);

    return tab;
  }

  private findTabById(tabId: string) {
    return this.configuredTabs.filter(t => t.id === tabId)[0];
  }
}
