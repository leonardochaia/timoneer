import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { MatTabsModule, MatIconModule, MatMenuModule, MatButtonModule } from '@angular/material';
import { TabHistoryService } from './tab-history.service';
import { TabStorageService } from './tab-storage.service';
import { TabService } from './tab.service';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
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
