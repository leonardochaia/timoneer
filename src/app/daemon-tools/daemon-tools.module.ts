import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerListComponent } from './container-list/container-list.component';
import { HttpClientModule } from '@angular/common/http';
import { SettingsModule } from '../settings/settings.module';
import {
  MatCardModule, MatIconModule,
  MatCheckboxModule, MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatProgressBarModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatChipsModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageListContainerComponent } from './image-list-container/image-list-container.component';
import { NgMathPipesModule } from 'angular-pipes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContainerAttacherComponent } from './container-attacher/container-attacher.component';
import { ContainerAttacherContainerComponent } from './container-attacher-container/container-attacher-container.component';
import { RouterModule } from '@angular/router';
import { ImagePullModalComponent } from './image-pull-modal/image-pull-modal.component';
import { ImagePullLogsComponent } from './image-pull-logs/image-pull-logs.component';
import { ContainerExecContainerComponent } from './container-exec-container/container-exec-container.component';
import { ContainerExecComponent } from './container-exec/container-exec.component';
import { ContainerCreateComponent } from './container-create/container-create.component';
import { ImageSelectorCardComponent } from './image-selector-card/image-selector-card.component';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,

    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatChipsModule,

    SharedModule,
    SettingsModule,

    NgMathPipesModule
  ],
  declarations: [
    ContainerListComponent,
    ImageListComponent,
    ImageListContainerComponent,
    ContainerAttacherComponent,
    ContainerAttacherContainerComponent,
    ImagePullLogsComponent,
    ImagePullModalComponent,
    ContainerExecContainerComponent,
    ContainerExecComponent,
    ContainerCreateComponent,
    ImageSelectorCardComponent,
  ],
  exports: [
    ContainerListComponent,
    ImageListComponent,
    ImageListContainerComponent,
    ContainerAttacherComponent,
    ContainerAttacherContainerComponent,
    ImagePullLogsComponent,
    ContainerCreateComponent,
    ContainerExecComponent,
    ImageSelectorCardComponent,
  ],
  entryComponents: [
    ImagePullModalComponent,
  ]
})
export class DaemonToolsModule { }
