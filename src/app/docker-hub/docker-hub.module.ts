import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule, MatIconModule, MatButtonModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DockerHubConfigStatusComponent } from './docker-hub-config-status/docker-hub-config-status.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,

    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,

    SharedModule
  ],
  declarations: [
    DockerHubConfigStatusComponent,
  ],
  exports: [
    DockerHubConfigStatusComponent
  ]
})
export class DockerHubModule { }
