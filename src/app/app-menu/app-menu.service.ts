import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from '../electron-tools/electron.service';
import { MenuItemConstructorOptions } from 'electron';
import { environment } from '../../environments/environment';
import { TabService } from '../tabs/tab.service';
import { TimoneerTabs } from '../timoneer-tabs';

@Injectable({
  providedIn: 'root'
})
export class AppMenuService {

  constructor(private electronService: ElectronService,
    private ngZone: NgZone,
    private tabService: TabService) { }

  public loadMenu() {
    const { Menu } = this.electronService.remote;

    const template: MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          { role: 'reload', accelerator: '' },
          { role: 'close', accelerator: '' },
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Settings',
            click: () => {
              this.openTab(TimoneerTabs.SETTINGS);
            }
          }
        ]
      },
      {
        label: 'Docker',
        submenu: [
          {
            label: 'Containers',
            click: () => {
              this.openTab(TimoneerTabs.DOCKER_CONTAINER_LIST);
            }
          },
          {
            label: 'Images',
            click: () => {
              this.openTab(TimoneerTabs.DOCKER_IMAGES);
            }
          },
          {
            label: 'Volumes',
            click: () => {
              this.openTab(TimoneerTabs.DOCKER_VOLUMES);
            }
          },
          {
            label: 'System',
            click: () => {
              this.openTab(TimoneerTabs.DOCKER_SYSTEM);
            }
          },
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'togglefullscreen' },
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click: () => {
              const shell = this.electronService.remote.shell;
              shell.openExternal('https://github.com/leonardochaia/timoneer');
            }
          }
        ]
      }
    ];

    if (!environment.production) {
      template.push({
        label: 'Development',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
        ]
      });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private openTab(tab: string) {
    this.ngZone.run(() => {
      this.tabService.add(tab);
    });
  }
}
