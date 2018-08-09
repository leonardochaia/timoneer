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
    this.tabService.currentTab = value;
  }

  @ViewChildren('dynamic', { read: ViewContainerRef })
  public tabsTemplates: QueryList<ViewContainerRef>;

  public get tabs() {
    return this.tabService.tabs;
  }

  constructor(private cd: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private tabService: TabService) {
  }

  public ngOnInit() {
  }

  public ngAfterViewInit() {
    this.tabsTemplates.changes.subscribe(() => {
      this.refresh();
    });
  }

  public removeTab(tab: ITimoneerTab) {
    this.tabService.removeTab(tab);
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
        console.log(componentRef);
        this.cd.detectChanges();
      }
    }
  }
}
