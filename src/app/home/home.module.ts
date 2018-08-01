import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeContainerComponent } from './home-container/home-container.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { RegistryModule } from '../registry/registry.module';
import { MatButtonModule, MatIconModule, MatCardModule } from '@angular/material';
import { ApplicationTemplatesModule } from '../application-templates/application-templates.module';
import { DaemonStatusCardComponent } from './daemon-status-card/daemon-status-card.component';
import { SharedModule } from '../shared/shared.module';
import { HubSettingsCardComponent } from './hub-settings-card/hub-settings-card.component';
import { RegistryCardsComponent } from './registry-cards/registry-cards.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,

    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,

    RegistryModule,
    ApplicationTemplatesModule,
    SharedModule,
  ],
  declarations: [
    HomeContainerComponent,
    DaemonStatusCardComponent,
    HubSettingsCardComponent,
    RegistryCardsComponent
  ]
})
export class HomeModule { }
