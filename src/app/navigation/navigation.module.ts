import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule,
  MatButtonModule, MatIconModule,
  MatSidenavModule, MatListModule,
  MatTabsModule, MatMenuModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DaemonToolsModule } from '../daemon-tools/daemon-tools.module';
import { AngularSplitModule } from 'angular-split-ng6';
import { FooterContainerComponent } from './footer-container/footer-container.component';
import { SidenavContainerComponent } from './sidenav-container/sidenav-container.component';
import { NavigationContainerComponent } from './navigation-container/navigation-container.component';
import { SharedModule } from '../shared/shared.module';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    AngularSplitModule,

    DaemonToolsModule,
    SharedModule,
  ],
  declarations: [
    FooterContainerComponent,
    SidenavContainerComponent,
    NavigationContainerComponent,
    TabsContainerComponent,
  ],
  exports: [
    NavigationContainerComponent
  ]
})
export class NavigationModule { }
