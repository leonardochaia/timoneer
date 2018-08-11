import { Injectable, OnDestroy } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class AppShortcutsService implements OnDestroy {

  constructor(private hotKey: HotkeysService) { }

  public add(shortcut: string[], action: (event?: KeyboardEvent) => void) {
    console.log(`Binded: ${shortcut[0]}`);
    const hotKey = new Hotkey(shortcut, (e) => {
      console.log(`Executed: ${shortcut[0]}`);
      action(e);
      return false;
    });
    this.hotKey.add(hotKey);
    return () => {
      console.log(`Unbinded: ${hotKey.combo[0]}`);
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
    console.log(`Unbinded All`);
    this.hotKey.reset();
  }
}
