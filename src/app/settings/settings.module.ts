import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsContainerComponent } from './settings-container/settings-container.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule,
  MatButtonModule, MatSnackBarModule, MatExpansionModule, MatCheckboxModule, MatDialogModule, MatProgressBarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrySettingsModalComponent } from './registry-settings-modal/registry-settings-modal.component';
import { SharedModule } from '../shared/shared.module';
import { NgMathPipesModule } from 'angular-pipes';
import { SettingsUpdaterComponent } from './settings-updater/settings-updater.component';

@NgModule({
  imports: [
    CommonModule,
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
    NgMathPipesModule,

    SharedModule,
  ],
  declarations: [
    SettingsContainerComponent,
    RegistrySettingsModalComponent,
    SettingsUpdaterComponent,
  ],
  entryComponents: [
    RegistrySettingsModalComponent,
  ],
  exports: [
    SettingsContainerComponent,
  ]
})
export class SettingsModule { }
