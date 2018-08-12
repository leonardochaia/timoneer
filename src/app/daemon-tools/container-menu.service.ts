import { Injectable } from '@angular/core';
import { ContainerInfo } from 'dockerode';
import { TabService } from '../tabs/tab.service';
import { TimoneerTabs } from '../timoneer-tabs';
import { DockerContainerService } from './docker-container.service';
import { NotificationService } from '../shared/notification.service';
import { ContextMenuService, ContextMenuConstructor } from '../electron-tools/context-menu.service';

@Injectable({
  providedIn: 'root'
})
export class ContainerMenuService {

  constructor(private menu: ContextMenuService,
    private containerService: DockerContainerService,
    private notificationService: NotificationService,
    private tabService: TabService) { }

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
      }
    ];

    if (container.State === 'running') {
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
        const obs = this.containerService.remove(container.Id);
        obs.subscribe(() => {
          this.notificationService.open(`${container.Names[0]} has been removed`);
        });
        return obs;
      }
    });

    return this.menu.open(template);
  }
}
