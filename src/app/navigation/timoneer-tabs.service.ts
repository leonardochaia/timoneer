import { Injectable } from '@angular/core';
import { TabService } from './tab.service';
import { ContainerAttacherContainerComponent } from '../daemon-tools/container-attacher-container/container-attacher-container.component';
import { ContainerExecContainerComponent } from '../daemon-tools/container-exec-container/container-exec-container.component';
import { SettingsContainerComponent } from '../settings/settings-container/settings-container.component';
import { ImageListContainerComponent } from '../daemon-tools/image-list-container/image-list-container.component';
import {
  ApplicationListContainerComponent
} from '../application-templates/application-list-container/application-list-container.component';
import { SystemContainerComponent } from '../daemon-tools/system-container/system-container.component';

@Injectable({
  providedIn: 'root'
})
export class TimoneerTabsService {

  constructor(private tabService: TabService) { }

  public attach(containerId: string, replace = false) {
    this.tabService.addTab({
      title: `Attached to ${containerId.slice(0, 12)}`,
      component: ContainerAttacherContainerComponent,
      params: containerId,
      replaceCurrent: replace
    });
  }

  public exec(containerId: string) {
    this.tabService.addTab({
      title: `Exec into ${containerId.slice(0, 12)}`,
      component: ContainerExecContainerComponent,
      params: containerId
    });
  }

  public openSystem() {
    this.tabService.addTab({
      title: 'Docker System',
      component: SystemContainerComponent,
    });
  }

  public openApplications() {
    this.tabService.addTab({
      title: 'Applications',
      component: ApplicationListContainerComponent,
    });
  }

  public openDockerImages() {
    this.tabService.addTab({
      title: 'Images',
      component: ImageListContainerComponent,
    });
  }

  public openSettings() {
    this.tabService.addTab({
      title: 'Settings',
      component: SettingsContainerComponent,
    });
  }
}
