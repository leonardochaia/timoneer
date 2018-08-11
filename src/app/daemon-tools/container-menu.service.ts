import { Injectable, NgZone } from '@angular/core';
import { ContainerInfo } from 'dockerode';
import { MenuItemConstructorOptions } from 'electron';
import { ElectronService } from '../electron-tools/electron.service';
import { TabService } from '../tabs/tab.service';
import { TimoneerTabs } from '../timoneer-tabs';
import { Subject } from 'rxjs';
import { DockerContainerService } from './docker-container.service';
import { NotificationService } from '../shared/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ContainerMenuService {

  constructor(private electron: ElectronService,
    private ngZone: NgZone,
    private containerService: DockerContainerService,
    private notificationService: NotificationService,
    private tabService: TabService) { }

  public open(container: ContainerInfo) {
    const { Menu } = this.electron.remote;

    const actionStarted = new Subject<any>();
    const actionFinished = new Subject<any>();

    const template: MenuItemConstructorOptions[] = [
      {
        label: 'Attach',
        click: () => {
          this.openTab(TimoneerTabs.DOCKER_ATTACH, {
            title: `Attached to ${container.Names[0]}`,
            params: container.Id,
          });
          actionFinished.next();
        },
      },
      {
        label: 'Exec',
        click: () => {
          this.openTab(TimoneerTabs.DOCKER_EXEC, {
            title: `Exec into ${container.Names[0]}`,
            params: container.Id,
          });
          actionFinished.next();
        },
      },
      {
        label: 'Remove',
        click: () => {
          this.ngZone.run(() => {
            actionStarted.next(`Removing ${container.Names[0]}`);
            this.containerService.remove(container.Id, { force: true })
              .subscribe((r) => {
                this.notificationService.open(`${container.Names[0]} has been removed.`);
                actionFinished.next(r);
              });
          });
        }
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    menu.popup({
      window: this.electron.remote.getCurrentWindow()
    });

    return {
      actionStarted,
      actionFinished,
    };
  }


  private openTab(tab: string, config?: any) {
    this.ngZone.run(() => {
      this.tabService.add(tab, config);
    });
  }
}
