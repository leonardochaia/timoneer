import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { MatTabsModule, MatIconModule, MatButtonModule } from '@angular/material';
import { TabHistoryService } from './tab-history.service';
import { TabStorageService } from './tab-storage.service';
import { TabService } from './tab.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ElectronToolsModule } from '../electron-tools/electron-tools.module';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,

    ElectronToolsModule,
  ],
  declarations: [
    TabsContainerComponent,
  ],
  providers: [
    TabService,
    TabStorageService,
    TabHistoryService,
  ],
  exports: [
    TabsContainerComponent,
  ]
})
export class TabsModule { }
