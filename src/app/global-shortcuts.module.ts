import { NgModule, APP_INITIALIZER } from '@angular/core';
import { TabService } from './tabs/tab.service';
import { TimoneerTabs } from './timoneer-tabs';
import { TabsModule } from './tabs/tabs.module';
import { AppShortcutsService } from './app-shortcuts/app-shortcuts.service';
import { TabHistoryService } from './tabs/tab-history.service';
import { AppShortcutsModule } from './app-shortcuts/app-shortcuts.module';

export function bindShortcuts(
  tabService: TabService,
  tabHistoryService: TabHistoryService,
  appShortcuts: AppShortcutsService) {
  return () => {

    appShortcuts.add(['command+w', 'ctrl+w'], () => {
      tabService.removeCurrentTab();
      return false;
    });

    appShortcuts.add(['command+shift+w', 'ctrl+shift+w'], () => {
      tabService.removeAllTabs();
      return false;
    });

    appShortcuts.add(['command+tab', 'ctrl+tab'], () => {
      let next = tabService.currentTab + 1;
      if (next >= tabService.tabs.length) {
        next = 0;
      }
      tabService.changeCurrentTab(next);
      return false;
    });

    appShortcuts.add(['command+shift+tab', 'ctrl+shift+tab'], () => {
      let next = tabService.currentTab - 1;
      if (next < 0) {
        next = tabService.tabs.length - 1;
      }
      tabService.changeCurrentTab(next);
      return false;
    });

    appShortcuts.add(['command+t', 'ctrl+t'], () => {
      tabService.add(TimoneerTabs.DOCKER_CONTAINER_NEW);
      return false;
    });

    appShortcuts.add(['command+shift+t', 'ctrl+shift+t'], () => {
      tabHistoryService.openTabFromHistory();
      return false;
    });
  };
}

@NgModule({
  imports: [
    TabsModule,
    AppShortcutsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: bindShortcuts,
      deps: [TabService, TabHistoryService, AppShortcutsService],
      multi: true
    },
  ]
})
export class GlobalShortcutsModule { }
