import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { MatTabsModule, MatIconModule, MatMenuModule, MatButtonModule } from '@angular/material';

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
  exports: [
    TabsContainerComponent,
  ]
})
export class TabsModule { }
