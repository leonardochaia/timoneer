import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsContainerComponent } from './settings-container/settings-container.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule,
  MatButtonModule, MatSnackBarModule, MatExpansionModule, MatCheckboxModule, MatDialogModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrySettingsModalComponent } from './registry-settings-modal/registry-settings-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDialogModule,
  ],
  declarations: [
    SettingsContainerComponent,
    RegistrySettingsModalComponent,
  ],
  entryComponents: [
    RegistrySettingsModalComponent,
  ],
  exports: [
    SettingsContainerComponent,
  ]
})
export class SettingsModule { }
