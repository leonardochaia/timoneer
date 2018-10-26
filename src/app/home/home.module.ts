import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeContainerComponent } from './home-container/home-container.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RegistryModule } from '../registry/registry.module';
import { MatButtonModule, MatIconModule, MatCardModule } from '@angular/material';
import { ApplicationTemplatesModule } from '../application-templates/application-templates.module';
import { DaemonStatusCardComponent } from './daemon-status-card/daemon-status-card.component';
import { SharedModule } from '../shared/shared.module';
import { DockerHubModule } from '../docker-hub/docker-hub.module';
import { DockerImagesModule } from '../docker-images/docker-image.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,

    MatCardModule,
    MatIconModule,
    MatButtonModule,

    RegistryModule,
    ApplicationTemplatesModule,
    DockerHubModule,
    DockerImagesModule,
    SharedModule,
  ],
  declarations: [
    HomeContainerComponent,
    DaemonStatusCardComponent,
  ]
})
export class HomeModule { }
