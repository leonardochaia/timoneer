import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShortcutsService } from './app-shortcuts.service';
import { HotkeysService } from './hotkey.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    HotkeysService,
    AppShortcutsService,
  ],
  declarations: []
})
export class AppShortcutsModule { }
