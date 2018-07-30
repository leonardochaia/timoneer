import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DaemonToolsModule } from '../daemon-tools/daemon-tools.module';
import { AngularSplitModule } from 'angular-split-ng6';
import { FooterContainerComponent } from './footer-container/footer-container.component';
import { SidenavContainerComponent } from './sidenav-container/sidenav-container.component';
import { NavigationContainerComponent } from './navigation-container/navigation-container.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    AngularSplitModule,

    DaemonToolsModule,
  ],
  declarations: [
    FooterContainerComponent,
    SidenavContainerComponent,
    NavigationContainerComponent,
  ]
})
export class NavigationModule { }
