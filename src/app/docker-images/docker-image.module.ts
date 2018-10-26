import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePreviewContainerComponent } from './image-preview-container/image-preview-container.component';
import { RegistryModule } from '../registry/registry.module';
import {
  MatCardModule,
  MatIconModule,
  MatTabsModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule
} from '@angular/material';
import { ImageHistoryComponent } from './image-history/image-history.component';
import { NgObjectPipesModule } from 'angular-pipes';
import { ManifestMetadataComponent } from './manifest-metadata/manifest-metadata.component';
import { SharedModule } from '../shared/shared.module';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageSourceListComponent } from './image-source-list/image-source-list.component';
import { ImageSourceListContainerComponent } from './image-source-list-container/image-source-list-container.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImageSourceMultiple, GlobalImageSources } from './image-source.model';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NgObjectPipesModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    FlexLayoutModule,

    RegistryModule,
    SharedModule,
  ],
  providers: [
    {
      provide: ImageSourceMultiple,
      useClass: GlobalImageSources,
      multi: true,
    }
  ],
  declarations: [
    ImagePreviewContainerComponent,
    ImageHistoryComponent,
    ManifestMetadataComponent,
    ImageListComponent,
    ImageSourceListComponent,
    ImageSourceListContainerComponent,
  ]
})
export class DockerImagesModule { }
