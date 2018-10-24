import { NgModule } from '@angular/core';
import { ContainerAttacherContainerComponent } from './daemon-tools/container-attacher-container/container-attacher-container.component';
import { ContainerExecContainerComponent } from './daemon-tools/container-exec-container/container-exec-container.component';
import { SystemContainerComponent } from './daemon-tools/system-container/system-container.component';
import {
  ApplicationListContainerComponent
} from './application-templates/application-list-container/application-list-container.component';
import { ImageListContainerComponent } from './daemon-tools/image-list-container/image-list-container.component';
import { SettingsContainerComponent } from './settings/settings-container/settings-container.component';
import {
  ApplicationLaunchContainerComponent
} from './application-templates/application-launch-container/application-launch-container.component';
import { ContainerCreateContainerComponent } from './daemon-tools/container-create-container/container-create-container.component';
import { RegistryListContainerComponent } from './registry/registry-list-container/registry-list-container.component';
import { HomeContainerComponent } from './home/home-container/home-container.component';
import { TimoneerTabs } from './timoneer-tabs';
import { VolumeListContainerComponent } from './daemon-tools/volume-list-container/volume-list-container.component';
import { VolumeCreateContainerComponent } from './daemon-tools/volume-create-container/volume-create-container.component';
import { TabsModule } from './tabs/tabs.module';
import { ContainerListContainerComponent } from './daemon-tools/container-list-container/container-list-container.component';
import { DaemonToolsModule } from './daemon-tools/daemon-tools.module';
import { HomeModule } from './home/home.module';
import { ApplicationTemplatesModule } from './application-templates/application-templates.module';
import { RegistryModule } from './registry/registry.module';
import { SettingsModule } from './settings/settings.module';
import { TabConfiguration } from './tabs/tab.model';
import { ContainerLauncherComponent } from './daemon-tools/container-launcher/container-launcher.component';
import {
  ApplicationEditListContainerComponent
} from './application-templates/application-edit-list-container/application-edit-list-container.component';
import { ContainerLogsContainerComponent } from './daemon-tools/container-logs-container/container-logs-container.component';
import { DockerHubRepoListContainerComponent } from './docker-hub/docker-hub-repo-list-container/docker-hub-repo-list-container.component';
import { ImagePreviewContainerComponent } from './docker-image-preview/image-preview-container/image-preview-container.component';
import { DockerImagePreviewModule } from './docker-image-preview/docker-image-preview.module';

const TIMONEER_AVAILABLE_TABS: TabConfiguration[] = [
  {
    id: TimoneerTabs.DOCKER_ATTACH,
    component: ContainerAttacherContainerComponent,
  },
  {
    id: TimoneerTabs.DOCKER_EXEC,
    component: ContainerExecContainerComponent,
  },
  {
    id: TimoneerTabs.DOCKER_LOGS,
    component: ContainerLogsContainerComponent,
  },
  {
    id: TimoneerTabs.DOCKER_SYSTEM,
    title: 'Docker System',
    component: SystemContainerComponent,
  },
  {
    id: TimoneerTabs.DOCKER_IMAGES,
    title: 'Images',
    component: ImageListContainerComponent,
  },
  {
    id: TimoneerTabs.DOCKER_CONTAINER_LIST,
    title: 'Containers',
    component: ContainerListContainerComponent,
  },
  {
    id: TimoneerTabs.DOCKER_CONTAINER_NEW,
    title: 'New Container',
    component: ContainerCreateContainerComponent,
  },
  {
    id: TimoneerTabs.DOCKER_CONTAINER_LAUNCHER,
    title: 'Launching Container',
    component: ContainerLauncherComponent,
  },
  {
    id: TimoneerTabs.DOCKER_VOLUMES,
    title: 'Volumes',
    component: VolumeListContainerComponent,
  },
  {
    id: TimoneerTabs.DOCKER_VOLUME_NEW,
    title: 'New Volume',
    component: VolumeCreateContainerComponent,
  },
  {
    id: TimoneerTabs.APPLICATION_LIST,
    title: 'Applications',
    component: ApplicationListContainerComponent,
  },
  {
    id: TimoneerTabs.APPLICATION_EDIT_LIST,
    title: 'Edit Applications',
    component: ApplicationEditListContainerComponent,
  },
  {
    id: TimoneerTabs.APPLICATION_LAUNCH,
    component: ApplicationLaunchContainerComponent,
  },
  {
    id: TimoneerTabs.REGISTRY_IMAGES,
    component: RegistryListContainerComponent,
  },
  {
    id: TimoneerTabs.DOCKERHUB_IMAGES,
    component: DockerHubRepoListContainerComponent,
  },
  {
    id: TimoneerTabs.IMAGE_PREVIEW,
    component: ImagePreviewContainerComponent,
  },
  {
    id: TimoneerTabs.DASHBOARD,
    title: 'Dashboard',
    component: HomeContainerComponent,
  },
  {
    id: TimoneerTabs.SETTINGS,
    title: 'Settings',
    component: SettingsContainerComponent,
  }
];

@NgModule({
  imports: [
    HomeModule,
    DaemonToolsModule,
    ApplicationTemplatesModule,
    RegistryModule,
    SettingsModule,
    DockerImagePreviewModule,
    TabsModule.forRoot(TIMONEER_AVAILABLE_TABS),
  ],
})
export class AppTabsModule { }
