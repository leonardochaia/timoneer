import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ImagePullModalComponent } from './image-pull-modal/image-pull-modal.component';

@Injectable({
  providedIn: 'root'
})
export class DaemonModalService {

  constructor(private dialog: MatDialog) { }

  public pullImageDialog(image: string) {
    this.dialog.open(ImagePullModalComponent, {
      data: { image },
      panelClass: ['app-modal', 'full-height']
    });
  }

}
