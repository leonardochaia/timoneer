import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShortcutsService } from './app-shortcuts.service';
import { HotkeyModule } from 'angular2-hotkeys';

@NgModule({
  imports: [
    CommonModule,
    HotkeyModule,
  ],
  providers: [
    AppShortcutsService,
  ],
  declarations: []
})
export class AppShortcutsModule { }
