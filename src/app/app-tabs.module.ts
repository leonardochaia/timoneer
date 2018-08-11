import { NgModule } from '@angular/core';
import { NavigationModule } from './navigation/navigation.module';
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
import { ITimoneerTab, APPLICATION_TABS } from './navigation/tab.model';
import { TimoneerTabs } from './timoneer-tabs';
import { VolumeListContainerComponent } from './daemon-tools/volume-list-container/volume-list-container.component';

const TIMONEER_AVAILABLE_TABS: ITimoneerTab[] = [
  {
    id: TimoneerTabs.DOCKER_ATTACH,
    component: ContainerAttacherContainerComponent,
  },
  {
    id: TimoneerTabs.DOCKER_EXEC,
    component: ContainerExecContainerComponent,
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
    id: TimoneerTabs.DOCKER_CONTAINER_NEW,
    title: 'New Container',
    component: ContainerCreateContainerComponent,
  },
  {
    id: TimoneerTabs.DOCKER_VOLUMES,
    title: 'Volumes',
    component: VolumeListContainerComponent,
  },
  {
    id: TimoneerTabs.APPLICATION_LIST,
    title: 'Applications',
    component: ApplicationListContainerComponent,
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
    NavigationModule,
  ],
  providers: [
    {
      provide: APPLICATION_TABS,
      useValue: TIMONEER_AVAILABLE_TABS
    }
  ]
})
export class AppTabsModule { }
