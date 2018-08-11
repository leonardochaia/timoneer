import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule,
  MatButtonModule, MatIconModule,
  MatSidenavModule, MatListModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DaemonToolsModule } from '../daemon-tools/daemon-tools.module';
import { FooterContainerComponent } from './footer-container/footer-container.component';
import { SidenavContainerComponent } from './sidenav-container/sidenav-container.component';
import { NavigationContainerComponent } from './navigation-container/navigation-container.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutSplitModule } from '../flex-layout-split/flex-layout-split.module';
import { TabsModule } from '../tabs/tabs.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,

    FlexLayoutSplitModule,
    TabsModule,

    DaemonToolsModule,
    SharedModule,
  ],
  declarations: [
    FooterContainerComponent,
    SidenavContainerComponent,
    NavigationContainerComponent,
  ],
  exports: [
    NavigationContainerComponent
  ]
})
export class NavigationModule { }
