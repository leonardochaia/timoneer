import { Injectable, NgZone } from '@angular/core';
import { MenuItemConstructorOptions, BrowserWindow, MenuItem } from 'electron';
import { ElectronService } from '../electron-tools/electron.service';
import { Subject, from, Observable, throwError } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';

export interface ContextMenuConstructor extends MenuItemConstructorOptions {
  click?: (menuItem: MenuItem, browserWindow: BrowserWindow, event: Event) => void | Observable<any>;
  submenu?: ContextMenuConstructor[];
}

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  constructor(private electron: ElectronService,
    private ngZone: NgZone) { }

  public open(templates: ContextMenuConstructor[]) {
    const { Menu } = this.electron.remote;

    const actionStarted = new Subject<any>();
    const actionFinished = new Subject<any>();

    templates.forEach(t => this.wrapClicks(t, actionStarted, actionFinished));

    const menu = Menu.buildFromTemplate(templates);
    menu.popup({
      window: this.electron.remote.getCurrentWindow()
    });

    return {
      actionStarted,
      actionFinished,
    };
  }

  private wrapClicks(
    template: ContextMenuConstructor,
    actionStarted: Subject<any>,
    actionFinished: Subject<any>) {

    if (template.click) {
      const originalClick = template.click;
      template.click = (a, b, c) => {
        actionStarted.next(template.label);
        this.ngZone.run(() => {
          const output = originalClick(a, b, c);
          if (output) {
            from(output as any)
              .pipe(
                take(1),
                map(result => {
                  actionFinished.next({ label: template.label, result: result });
                  return result;
                }),
                catchError(e => {
                  actionFinished.next({ label: template.label, error: e });
                  return throwError(e);
                })
              );
          } else {
            actionFinished.next({ label: template.label });
          }
        });
      };
    }

    const { Menu } = this.electron.remote;
    if (template.submenu && !(template instanceof Menu)) {
      template.submenu.forEach(t => this.wrapClicks(t, actionStarted, actionFinished));
    }
  }
}
