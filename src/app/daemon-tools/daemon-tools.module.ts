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
import { NgObjectPipesModule } from 'angular-pipes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContainerAttacherComponent } from './container-attacher/container-attacher.component';
import { ContainerAttacherContainerComponent } from './container-attacher-container/container-attacher-container.component';
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
import { VolumeCreateComponent } from './volume-create/volume-create.component';
import { VolumeCreateContainerComponent } from './volume-create-container/volume-create-container.component';
import { ContainerListContainerComponent } from './container-list-container/container-list-container.component';
import { ContainerLauncherComponent } from './container-launcher/container-launcher.component';
import { PullImageJobLogsComponent } from './pull-image-job-logs/pull-image-job-logs.component';
import { JobsModule } from '../jobs/jobs.module';
import { TimDialogModule } from '../tim-dialog/tim-dialog.module';
import { ContainerInspectCardsComponent } from './container-inspect-cards/container-inspect-cards.component';
import { ContainerLogsContainerComponent } from './container-logs-container/container-logs-container.component';

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
    TimDialogModule,
    SettingsModule,
    JobsModule,

    NgObjectPipesModule,
  ],
  declarations: [
    ContainerListComponent,
    ImageListComponent,
    ContainerAttacherComponent,
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
    VolumeCreateComponent,
    VolumeCreateContainerComponent,
    ContainerListContainerComponent,
    PullImageJobLogsComponent,
    ContainerLauncherComponent,
    ContainerInspectCardsComponent,
    ContainerLogsContainerComponent,
  ],
  exports: [
    ContainerListComponent,
    ImageListComponent,
    ImageListContainerComponent,
    ContainerAttacherComponent,
    ContainerAttacherContainerComponent,
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
    PullImageJobLogsComponent,
  ]
})
export class DaemonToolsModule { }
