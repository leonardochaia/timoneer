import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarContainerComponent } from './toolbar-container/toolbar-container.component';
import { MatToolbarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DaemonToolsModule } from '../daemon-tools/daemon-tools.module';
import { AngularSplitModule } from 'angular-split-ng6';
import { FooterContainerComponent } from './footer-container/footer-container.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    AngularSplitModule,

    DaemonToolsModule,
  ],
  declarations: [ToolbarContainerComponent, FooterContainerComponent]
})
export class NavigationModule { }
