import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule, MatIconModule, MatButtonModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageSource } from '../docker-images/image-source.model';
import { DockerHubImageSource } from './docker-hub.image-source';

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
  providers: [
    {
      provide: ImageSource,
      useClass: DockerHubImageSource,
      multi: true
    }
  ]
})
export class DockerHubModule { }
