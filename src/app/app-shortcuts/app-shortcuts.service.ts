import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { HotkeysService, Hotkey } from './hotkey.service';

@Injectable()
export class AppShortcutsService implements OnDestroy {

  constructor(private hotKey: HotkeysService) { }

  public add(shortcut: string[], action: (event?: KeyboardEvent) => void) {
    const hotKey = new Hotkey(shortcut, (e) => {
      action(e);
      return false;
    });
    this.hotKey.add(hotKey);
    return () => {
      this.hotKey.remove(hotKey);
    };
  }

  public addUntil(shortcut: string[], obs: Observable<any>, action: (event?: KeyboardEvent) => void) {
    const deregister = this.add(shortcut, action);
    obs
      .pipe(take(1))
      .subscribe(deregister);
  }

  public ngOnDestroy() {
    this.hotKey.reset();
  }
}
