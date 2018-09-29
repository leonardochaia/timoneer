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
import { SettingsUpdaterComponent } from './settings-updater/settings-updater.component';
import { JobsModule } from '../jobs/jobs.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
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
    JobsModule,
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
