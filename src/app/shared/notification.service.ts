import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

export interface NotificationConfig {
  duration?: number;
  /** Extra CSS classes to be added to the snack bar container. */
  panelClass?: string | string[];
  /** The horizontal position to place the snack bar. */
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  /** The vertical position to place the snack bar. */
  verticalPosition?: 'top' | 'bottom';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  public open(message: string, action?: string, config?: NotificationConfig) {
    config = config || { duration: 3000 };
    if (!config.duration) {
      config.duration = 3000;
    }
    return this.snackBar.open(message, action, config);
  }

}
