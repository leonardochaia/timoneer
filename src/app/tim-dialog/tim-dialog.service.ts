import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TimDialogData } from './tim-dialog-model';
import { TimDialogRendererComponent } from './tim-dialog-renderer/tim-dialog-renderer.component';

@Injectable()
export class TimDialogService {

  constructor(private dialog: MatDialog) { }

  public openErrorMessageModal(title: string, error: string, debuggingInfo?: string) {
    return this.openMessageModal({
      title: title,
      titleClass: 'mat-text-warn',
      message: error,
      debuggingInfo: debuggingInfo,
      cancelButton: {
        text: 'Close',
        icon: 'close',
      }
    });
  }

  public openMessageModal(data: Partial<TimDialogData>) {
    if (!data.cancelButton) {
      data.cancelButton = {
        text: 'Cancel',
        icon: 'close',
      };
    }

    return this.dialog.open(TimDialogRendererComponent, {
      data: data,
      panelClass: 'mat-typography',
    });
  }
}
