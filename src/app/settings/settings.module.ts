import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsContainerComponent } from './settings-container/settings-container.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule,
  MatButtonModule, MatSnackBarModule, MatExpansionModule, MatCheckboxModule, MatDialogModule, MatProgressBarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrySettingsModalComponent } from './registry-settings-modal/registry-settings-modal.component';
import { SharedModule } from '../shared/shared.module';

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
    MatProgressBarModule,

    SharedModule,
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
