import { Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { ITimoneerTab } from './tab.model';

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

  constructor() { }

  public addTab(config: {
    title: string,
    component: Type<any>,
    params?: any,
    multiple?: boolean,
    replaceCurrent?: boolean
  }) {

    let tab: ITimoneerTab;
    if (!config.multiple) {
      tab = this.tabs.filter(x => x.title === config.title && x.component === config.component && x.params === config.params)[0];
    }

    if (!tab) {
      tab = {
        title: config.title,
        component: config.component,
        params: config.params
      };
      this.tabs.push(tab);
    }

    if (config.replaceCurrent) {
      this.removeCurrentTab();
    }

    this.currentTab = this.tabs.indexOf(tab);
    this.tabAddedSubject.next(tab);

    return tab;
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
}
