import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RegistrySettingsModalComponent } from './registry-settings-modal/registry-settings-modal.component';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SettingsDialogService {

  constructor(private matDialog: MatDialog) { }

  public openRegistrySettingsDialog(registryFormGroup: FormGroup) {
    return this.matDialog.open(RegistrySettingsModalComponent, {
      data: registryFormGroup,
    });
  }
}
