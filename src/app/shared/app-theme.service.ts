import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';

const THEMES = [
  'indigo-dark-theme',
  'indigo-theme',
];

@Injectable({
  providedIn: 'root'
})
export class AppThemeService {

  public get theme() {
    return this.currentTheme.asObservable()
      .pipe(startWith(this.defaultTheme));
  }

  protected currentTheme = new Subject<string>();

  private defaultTheme = THEMES[0];
}
