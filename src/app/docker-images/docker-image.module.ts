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
  MatButtonModule,
  MatAutocompleteModule,
  MatChipsModule
} from '@angular/material';
import { ImageHistoryComponent } from './image-history/image-history.component';
import { NgObjectPipesModule } from 'angular-pipes';
import { SharedModule } from '../shared/shared.module';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageSourceListComponent } from './image-source-list/image-source-list.component';
import { ImageSourceListContainerComponent } from './image-source-list-container/image-source-list-container.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImageSourceMultiple, GlobalImageSources } from './image-source.model';
import { ImageSourceCardListComponent } from './image-source-card-list/image-source-card-list.component';
import { ImageSelectCardComponent } from './image-select-card/image-select-card.component';
import { ImageTagsSelectorComponent } from './image-tags-selector/image-tags-selector.component';
import { ImageInfoCardsComponent } from './image-info-cards/image-info-cards.component';

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
    MatAutocompleteModule,
    MatChipsModule,
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
    ImageListComponent,
    ImageSourceListComponent,
    ImageSourceListContainerComponent,
    ImageSourceCardListComponent,
    ImageSelectCardComponent,
    ImageTagsSelectorComponent,
    ImageInfoCardsComponent,
  ],
  exports: [
    ImageSourceCardListComponent,
    ImageSelectCardComponent
  ]
})
export class DockerImagesModule { }
