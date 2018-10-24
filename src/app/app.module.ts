import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NavigationModule } from './navigation/navigation.module';
import { AppTabsModule } from './app-tabs.module';
import { GlobalShortcutsModule } from './global-shortcuts.module';
import { AppMenuModule } from './app-menu/app-menu.module';
import { JobsModule } from './jobs/jobs.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    JobsModule.forRoot(),

    AppTabsModule,
    AppMenuModule,
    GlobalShortcutsModule,

    NavigationModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
