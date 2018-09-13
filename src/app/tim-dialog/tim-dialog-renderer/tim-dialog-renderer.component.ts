import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TimDialogData } from '../tim-dialog-model';

@Component({
  selector: 'tim-dialog-renderer',
  templateUrl: './tim-dialog-renderer.component.html',
  styleUrls: ['./tim-dialog-renderer.component.scss']
})
export class TimDialogRendererComponent implements OnInit {

  constructor(
    private dialog: MatDialogRef<TimDialogRendererComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: TimDialogData) { }

  public ngOnInit() {
  }

  public onConfirm() {
    if (this.data.confirmButton && this.data.confirmButton.action) {
      this.data.confirmButton.action(this.dialog);
    }
    this.dialog.close();
  }

  public onClose() {
    if (this.data.cancelButton && this.data.cancelButton.action) {
      this.data.cancelButton.action(this.dialog);
    }
    this.dialog.close();
  }
}
