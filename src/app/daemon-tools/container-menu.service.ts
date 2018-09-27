import { Injectable } from '@angular/core';
import { ContainerInfo } from 'dockerode';
import { TabService } from '../tabs/tab.service';
import { TimoneerTabs } from '../timoneer-tabs';
import { DockerContainerService } from './docker-container.service';
import { NotificationService } from '../shared/notification.service';
import { ContextMenuService, ContextMenuConstructor } from '../electron-tools/context-menu.service';
import { TimDialogService } from '../tim-dialog/tim-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class ContainerMenuService {

  constructor(private menu: ContextMenuService,
    private containerService: DockerContainerService,
    private notificationService: NotificationService,
    private tabService: TabService,
    private timDialog: TimDialogService) { }

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
        if (isRunning) {
          this.timDialog.openMessageModal({
            title: `Force remove ${container.Names[0]}`,
            message: 'The container is running and must be forced to be removed.',
            confirmButton: {
              color: 'warn',
              icon: 'delete',
              text: 'Force Removal',
              action: () => {
                this.deleteContainer(container, true);
              }
            }
          });
        } else {
          this.deleteContainer(container);
        }
      }
    });

    return this.menu.open(template);
  }

  protected deleteContainer(container: ContainerInfo, force = false) {
    const obs = this.containerService.remove(container.Id, {
      force: force
    });
    obs.subscribe(() => {
      this.notificationService.open(`${container.Names[0]} has been removed`);
    });
    return obs;
  }
}
