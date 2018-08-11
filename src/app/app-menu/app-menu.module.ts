import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronToolsModule } from '../electron-tools/electron-tools.module';
import { TabsModule } from '../tabs/tabs.module';

@NgModule({
  imports: [
    CommonModule,

    ElectronToolsModule,
    TabsModule,
  ],
  declarations: []
})
export class AppMenuModule { }
