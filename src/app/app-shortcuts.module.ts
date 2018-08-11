import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HotkeyModule, HotkeysService, Hotkey } from 'angular2-hotkeys';
import { TabService } from './tabs/tab.service';
import { TimoneerTabs } from './timoneer-tabs';
import { TabsModule } from './tabs/tabs.module';

export function bindShortcuts(tabService: TabService, hotKey: HotkeysService) {
  return () => {
    hotKey.add(new Hotkey(['command+w', 'ctrl+w'], (event: KeyboardEvent): boolean => {
      tabService.removeCurrentTab();
      return false;
    }));
    hotKey.add(new Hotkey(['command+shift+w', 'ctrl+shift+w'], (event: KeyboardEvent): boolean => {
      tabService.removeAllTabs();
      return false;
    }));
    hotKey.add(new Hotkey(['command+tab', 'ctrl+tab'], (event: KeyboardEvent): boolean => {
      let next = tabService.currentTab + 1;
      if (next >= tabService.tabs.length) {
        next = 0;
      }
      tabService.changeCurrentTab(next);
      return false;
    }));
    hotKey.add(new Hotkey(['command+shift+tab', 'ctrl+shift+tab'], (event: KeyboardEvent): boolean => {
      let next = tabService.currentTab - 1;
      if (next < 0) {
        next = tabService.tabs.length - 1;
      }
      tabService.changeCurrentTab(next);
      return false;
    }));
    hotKey.add(new Hotkey(['command+t', 'ctrl+t'], (event: KeyboardEvent): boolean => {
      tabService.add(TimoneerTabs.DOCKER_CONTAINER_NEW);
      return false;
    }));
    hotKey.add(new Hotkey(['command+shift+t', 'ctrl+shift+t'], (event: KeyboardEvent): boolean => {
      tabService.openTabFromHistory();
      return false;
    }));
  };
}

@NgModule({
  imports: [
    TabsModule,
    HotkeyModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: bindShortcuts,
      deps: [TabService, HotkeysService],
      multi: true
    },
  ]
})
export class AppShortcutsModule { }
