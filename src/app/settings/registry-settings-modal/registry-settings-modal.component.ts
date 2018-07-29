import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'tim-registry-settings-modal',
  templateUrl: './registry-settings-modal.component.html',
  styleUrls: ['./registry-settings-modal.component.scss']
})
export class RegistrySettingsModalComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<RegistrySettingsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public registryFormGroup: FormGroup) { }

  public ngOnInit() {
  }

  public close() {
    this.dialogRef.close();
  }

}
