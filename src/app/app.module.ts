import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NavigationModule } from './navigation/navigation.module';
import { HomeModule } from './home/home.module';
import { DaemonToolsModule } from './daemon-tools/daemon-tools.module';
import { RegistryModule } from './registry/registry.module';
import { SettingsModule } from './settings/settings.module';
import { ApplicationTemplatesModule } from './application-templates/application-templates.module';
import { HotkeyModule } from 'angular2-hotkeys';
import { AppTabsModule } from './app-tabs.module';
import { GlobalShortcutsModule } from './global-shortcuts.module';
import { AppMenuModule } from './app-menu/app-menu.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HotkeyModule.forRoot(),

    AppTabsModule,
    AppMenuModule,
    GlobalShortcutsModule,

    HomeModule,
    DaemonToolsModule,
    RegistryModule,
    SettingsModule,
    NavigationModule,
    ApplicationTemplatesModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
