import { Injectable } from '@angular/core';
import { ContainerInfo } from 'dockerode';
import { TabService } from '../tabs/tab.service';
import { TimoneerTabs } from '../timoneer-tabs';
import { DockerContainerService } from './docker-container.service';
import { NotificationService } from '../shared/notification.service';
import { ContextMenuService, ContextMenuConstructor } from '../electron-tools/context-menu.service';
import { ContainerDeletionService } from './container-deletion.service';

@Injectable({
  providedIn: 'root'
})
export class ContainerMenuService {

  constructor(
    private readonly menu: ContextMenuService,
    private readonly containerService: DockerContainerService,
    private readonly notificationService: NotificationService,
    private readonly tabService: TabService,
    private readonly containerDeletion: ContainerDeletionService) { }

  public open(container: ContainerInfo) {

    const template: ContextMenuConstructor[] = [
      {
        label: 'Attach',
        click: () => {
          this.tabService.add(TimoneerTabs.DOCKER_ATTACH, {
            title: `Attached to ${container.Names[0]}`,
            params: container.Id,
          });
        },
      },
      {
        label: 'Exec',
        click: () => {
          this.tabService.add(TimoneerTabs.DOCKER_EXEC, {
            title: `Exec into ${container.Names[0]}`,
            params: container.Id,
          });
        },
      },
      {
        label: 'Logs',
        click: () => {
          this.tabService.add(TimoneerTabs.DOCKER_LOGS, {
            title: `Logs from ${container.Names[0]}`,
            params: container.Id,
          });
        },
      }
    ];

    const isRunning = container.State === 'running';

    if (isRunning) {
      template.push({
        label: 'Stop',
        click: () => {
          const obs = this.containerService.stop(container.Id);
          obs.subscribe(() => {
            this.notificationService.open(`${container.Names[0]} stopped`);
          });
          return obs;
        }
      });
    } else {
      template.push({
        label: 'Start',
        click: () => {
          const obs = this.containerService.start(container.Id);
          obs.subscribe(() => {
            this.notificationService.open(`${container.Names[0]} started`);
            this.tabService.add(TimoneerTabs.DOCKER_ATTACH, {
              title: `Attached to ${container.Names[0]}`,
              params: container.Id,
            });
          });
          return obs;
        }
      });
    }

    template.push({
      label: 'Remove',
      click: () => {
        this.containerDeletion.deleteContainer(container.Id, container.State, container.Names[0]);
      }
    });

    return this.menu.open(template);
  }
}
