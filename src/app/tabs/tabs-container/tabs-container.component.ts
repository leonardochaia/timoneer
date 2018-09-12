import {
  Component, ComponentFactoryResolver,
  AfterViewInit, ViewChildren,
  ViewContainerRef, QueryList,
  ChangeDetectorRef,
  Injector
} from '@angular/core';
import { TAB_DATA, Tab } from '../tab.model';
import { TabService } from '../tab.service';
import { MatTabChangeEvent } from '@angular/material';
import { ContextMenuConstructor, ContextMenuService } from '../../electron-tools/context-menu.service';

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

  @ViewChildren('tabTemplate', { read: ViewContainerRef })
  public tabsTemplates: QueryList<ViewContainerRef>;

  public get tabs() {
    return this.tabService.tabs;
  }

  constructor(private cd: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private tabService: TabService,
    private contextMenuService: ContextMenuService) {
  }

  public ngAfterViewInit() {
    // Tabs are added using the TabService.
    // That updates the view with the ngFor
    // which executes the tabsTemplate changes
    // tab components are re-created if they do not exist.
    this.tabsTemplates.changes.subscribe(() => {
      this.updateTabsComponents();
    });
    this.updateTabsComponents();
  }

  public tabFocusChanged(event: MatTabChangeEvent) {
    this.selectedTab = event.index;
    this.executeCurrentTabComponentFunction('timTabFocused');
  }

  public animationDone() {
    this.executeCurrentTabComponentFunction('timTabAnimationDone');
  }

  public removeTab(tab: Tab) {
    this.tabService.removeTab(tab);
  }

  public removeAllTabs() {
    this.tabService.removeAllTabs();
  }

  public removeOtherTabs(tab: Tab) {
    this.tabService.removeOtherTabs(tab);
  }

  public openTabMenu(tab: Tab) {
    const template: ContextMenuConstructor[] = [
      {
        label: 'Close',
        click: () => {
          this.removeTab(tab);
        }
      },
      {
        label: 'Close Others',
        click: () => {
          this.removeOtherTabs(tab);
        }
      },
      {
        label: 'Close All',
        click: () => {
          this.removeAllTabs();
        }
      }
    ];

    this.contextMenuService.open(template);
  }

  private updateTabsComponents() {
    const templates = this.tabsTemplates.toArray();
    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i];
      const config = tab.configuration;
      const template = templates[i];

      if (!tab.componentInstance) {

        template.clear();

        const injector = Injector.create([
          {
            provide: TAB_DATA,
            useValue: config.params
          }
        ], template.parentInjector);

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(config.component);
        const componentRef = template.createComponent(componentFactory, null, injector);
        tab.setComponent(componentRef.instance);
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
