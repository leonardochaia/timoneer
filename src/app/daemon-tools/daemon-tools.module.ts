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
  MatBottomSheetModule
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
import { ContainerCreateComponent } from './container-create/container-create.component';
import { ImageSelectorCardComponent } from './image-selector-card/image-selector-card.component';
import { ContainerCreateContainerComponent } from './container-create-container/container-create-container.component';
import { ContainerActionsSheetComponent } from './container-actions-sheet/container-actions-sheet.component';
import { DaemonService } from './daemon.service';
import { DaemonEventsService } from './daemon-events.service';
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
    ContainerCreateComponent,
    ImageSelectorCardComponent,
    ContainerCreateContainerComponent,
    ContainerActionsSheetComponent,
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
    DaemonEventsService,
  ],
  entryComponents: [
    ImagePullModalComponent,
    ContainerActionsSheetComponent,
  ]
})
export class DaemonToolsModule { }
