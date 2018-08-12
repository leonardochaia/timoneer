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
  MatDividerModule,
  MatRadioModule,
  MatTooltipModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageListContainerComponent } from './image-list-container/image-list-container.component';
import { NgMathPipesModule, NgObjectPipesModule } from 'angular-pipes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContainerAttacherComponent } from './container-attacher/container-attacher.component';
import { ContainerAttacherContainerComponent } from './container-attacher-container/container-attacher-container.component';
import { ImagePullModalComponent } from './image-pull-modal/image-pull-modal.component';
import { ImagePullLogsComponent } from './image-pull-logs/image-pull-logs.component';
import { ContainerExecContainerComponent } from './container-exec-container/container-exec-container.component';
import { ContainerCreateComponent } from './container-create/container-create.component';
import { ImageSelectorCardComponent } from './image-selector-card/image-selector-card.component';
import { ContainerCreateContainerComponent } from './container-create-container/container-create-container.component';
import { DockerService } from './docker.service';
import { DockerEventsService } from './docker-events.service';
import { SystemContainerComponent } from './system-container/system-container.component';
import { DockerImageService } from './docker-image.service';
import { DockerSystemService } from './docker-system.service';
import { DockerContainerService } from './docker-container.service';
import { ContainerCreatePortMappingComponent } from './container-create-port-mapping/container-create-port-mapping.component';
import { ContainerCreateVolumeMappingComponent } from './container-create-volume-mapping/container-create-volume-mapping.component';
import { DockerVolumeService } from './docker-volume.service';
import { VolumeListComponent } from './volume-list/volume-list.component';
import { VolumeListContainerComponent } from './volume-list-container/volume-list-container.component';
import { VolumeActionsSheetComponent } from './volume-actions-sheet/volume-actions-sheet.component';
import { VolumeCreateComponent } from './volume-create/volume-create.component';
import { VolumeCreateContainerComponent } from './volume-create-container/volume-create-container.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

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
    MatRadioModule,
    MatTooltipModule,

    SharedModule,
    SettingsModule,

    NgMathPipesModule,
    NgObjectPipesModule,
  ],
  declarations: [
    ContainerListComponent,
    ImageListComponent,
    ContainerAttacherComponent,
    ImagePullLogsComponent,
    ImagePullModalComponent,
    ImageSelectorCardComponent,
    ContainerCreateComponent,
    ContainerCreatePortMappingComponent,
    ContainerCreateVolumeMappingComponent,
    ImageListContainerComponent,
    ContainerAttacherContainerComponent,
    ContainerExecContainerComponent,
    ContainerCreateContainerComponent,
    SystemContainerComponent,
    VolumeListComponent,
    VolumeListContainerComponent,
    VolumeActionsSheetComponent,
    VolumeCreateComponent,
    VolumeCreateContainerComponent,
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
    DockerService,
    DockerEventsService,
    DockerImageService,
    DockerSystemService,
    DockerContainerService,
    DockerVolumeService,
  ],
  entryComponents: [
    ImagePullModalComponent,
    VolumeActionsSheetComponent,
    ImageListContainerComponent,
    ContainerAttacherContainerComponent,
    ContainerExecContainerComponent,
    ContainerCreateContainerComponent,
    VolumeListContainerComponent,
    VolumeCreateContainerComponent,
    SystemContainerComponent,
  ]
})
export class DaemonToolsModule { }
