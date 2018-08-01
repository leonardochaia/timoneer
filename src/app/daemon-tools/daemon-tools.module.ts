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
  MatChipsModule,
  MatListModule,
  MatBottomSheetModule,
  MatDividerModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageListContainerComponent } from './image-list-container/image-list-container.component';
import { NgMathPipesModule, NgObjectPipesModule } from 'angular-pipes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContainerAttacherComponent } from './container-attacher/container-attacher.component';
import { ContainerAttacherContainerComponent } from './container-attacher-container/container-attacher-container.component';
import { RouterModule } from '@angular/router';
import { ImagePullModalComponent } from './image-pull-modal/image-pull-modal.component';
import { ImagePullLogsComponent } from './image-pull-logs/image-pull-logs.component';
import { ContainerExecContainerComponent } from './container-exec-container/container-exec-container.component';
import { ContainerCreateComponent } from './container-create/container-create.component';
import { ImageSelectorCardComponent } from './image-selector-card/image-selector-card.component';
import { ContainerCreateContainerComponent } from './container-create-container/container-create-container.component';
import { ContainerActionsSheetComponent } from './container-actions-sheet/container-actions-sheet.component';
import { DaemonService } from './daemon.service';
import { DockerEventsService } from './docker-events.service';
import { SystemContainerComponent } from './system-container/system-container.component';
import { DockerImageService } from './docker-image.service';
import { DockerSystemService } from './docker-system.service';
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
    MatListModule,
    MatBottomSheetModule,
    MatDividerModule,

    SharedModule,
    SettingsModule,

    NgMathPipesModule,
    NgObjectPipesModule,
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
    ContainerCreateComponent,
    ImageSelectorCardComponent,
    ContainerCreateContainerComponent,
    ContainerActionsSheetComponent,
    SystemContainerComponent,
  ],
  exports: [
    ContainerListComponent,
    ImageListComponent,
    ImageListContainerComponent,
    ContainerAttacherComponent,
    ContainerAttacherContainerComponent,
    ImagePullLogsComponent,
    ContainerCreateComponent,
    ImageSelectorCardComponent,
  ],
  providers: [
    DaemonService,
    DockerEventsService,
    DockerImageService,
    DockerSystemService,
  ],
  entryComponents: [
    ImagePullModalComponent,
    ContainerActionsSheetComponent,
  ]
})
export class DaemonToolsModule { }
