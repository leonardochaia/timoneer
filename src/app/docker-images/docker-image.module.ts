import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePreviewContainerComponent } from './image-preview-container/image-preview-container.component';
import { RegistryModule } from '../registry/registry.module';
import { MatCardModule, MatIconModule } from '@angular/material';
import { ImageHistoryComponent } from './image-history/image-history.component';
import { NgObjectPipesModule } from 'angular-pipes';
import { ManifestMetadataComponent } from './manifest-metadata/manifest-metadata.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RegistryModule,
    NgObjectPipesModule,
    MatCardModule,
    MatIconModule,
    SharedModule,
  ],
  declarations: [
    ImagePreviewContainerComponent,
    ImageHistoryComponent,
    ManifestMetadataComponent,
  ]
})
export class DockerImagesModule { }
