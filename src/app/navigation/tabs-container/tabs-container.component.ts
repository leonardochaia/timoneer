import {
  Component, ComponentFactoryResolver,
  AfterViewInit, ViewChildren,
  ViewContainerRef, QueryList,
  ChangeDetectorRef,
  OnInit,
  Injector
} from '@angular/core';
import { ITimoneerTab, TAB_DATA } from '../tab.model';
import { TabService } from '../tab.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MatTabChangeEvent } from '@angular/material';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss']
})
export class TabsContainerComponent implements OnInit, AfterViewInit {

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
    private tabService: TabService,
    private hotKey: HotkeysService) {
  }

  public ngOnInit() {
    this.bindShortcuts();
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

  private bindShortcuts() {
    this.hotKey.add(new Hotkey(['command+w', 'ctrl+w'], (event: KeyboardEvent): boolean => {
      this.tabService.removeCurrentTab();
      return false;
    }));
    this.hotKey.add(new Hotkey(['command+shift+w', 'ctrl+shift+w'], (event: KeyboardEvent): boolean => {
      this.tabService.removeAllTabs();
      return false;
    }));
    this.hotKey.add(new Hotkey(['command+tab', 'ctrl+tab'], (event: KeyboardEvent): boolean => {
      let next = this.tabService.currentTab + 1;
      if (next >= this.tabs.length) {
        next = 0;
      }
      this.tabService.changeCurrentTab(next);
      return false;
    }));
    this.hotKey.add(new Hotkey(['command+shift+tab', 'ctrl+shift+tab'], (event: KeyboardEvent): boolean => {
      let next = this.tabService.currentTab - 1;
      if (next < 0) {
        next = this.tabs.length - 1;
      }
      this.tabService.changeCurrentTab(next);
      return false;
    }));
    this.hotKey.add(new Hotkey(['command+t', 'ctrl+t'], (event: KeyboardEvent): boolean => {
      this.tabService.add(TimoneerTabs.DOCKER_CONTAINER_NEW);
      return false;
    }));
    this.hotKey.add(new Hotkey(['command+shift+t', 'ctrl+shift+t'], (event: KeyboardEvent): boolean => {
      this.tabService.openTabFromHistory();
      return false;
    }));
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
