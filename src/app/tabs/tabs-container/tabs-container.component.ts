import {
  Component, ComponentFactoryResolver,
  AfterViewInit, ViewChildren,
  ViewContainerRef, QueryList,
  ChangeDetectorRef,
  Injector
} from '@angular/core';
import { ITimoneerTab, TAB_DATA } from '../tab.model';
import { TabService } from '../tab.service';
import { MatTabChangeEvent } from '@angular/material';
import { TabStorageService } from '../tab-storage.service';
import { TabHistoryService } from '../tab-history.service';

@Component({
  selector: 'tim-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss']
})
export class TabsContainerComponent implements AfterViewInit {

  public get selectedTab() {
    return this.tabService.currentTab;
  }

  public set selectedTab(value: number) {
    this.tabService.changeCurrentTab(value);
  }

  @ViewChildren('dynamic', { read: ViewContainerRef })
  public tabsTemplates: QueryList<ViewContainerRef>;

  public get tabs() {
    return this.tabService.tabs;
  }

  constructor(private cd: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    tabStorageService: TabStorageService,
    tabHistoryService: TabHistoryService,
    private tabService: TabService) {

    tabStorageService.initialize();
    tabHistoryService.initialize();
  }

  public ngAfterViewInit() {
    this.tabsTemplates.changes.subscribe(() => {
      this.refresh();
    });
    this.refresh();
  }

  public tabFocusChanged(event: MatTabChangeEvent) {
    this.selectedTab = event.index;
    this.executeCurrentTabComponentFunction('timTabFocused');
  }

  public animationDone() {
    this.executeCurrentTabComponentFunction('timTabAnimationDone');
  }

  public removeTab(tab: ITimoneerTab) {
    this.tabService.removeTab(tab);
  }

  public removeAllTabs() {
    this.tabService.removeAllTabs();
  }

  public removeOtherTabs(tab: ITimoneerTab) {
    this.tabService.removeOtherTabs(tab);
  }

  private refresh() {
    const templates = this.tabsTemplates.toArray();
    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i];
      const template = templates[i];

      if (!tab.componentInstance) {

        template.clear();

        const injector = Injector.create([
          {
            provide: TAB_DATA,
            useValue: tab.params
          }
        ], template.parentInjector);

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(tab.component);
        const componentRef = template.createComponent(componentFactory, null, injector);
        tab.componentInstance = componentRef.instance;
        this.cd.detectChanges();
      }
    }
  }

  private executeCurrentTabComponentFunction(fn: string) {
    const tab = this.tabs[this.selectedTab];
    if (tab && tab.componentInstance
      && tab.componentInstance[fn]
      && typeof tab.componentInstance[fn] === 'function') {
      tab.componentInstance[fn]();
    }
  }
}
