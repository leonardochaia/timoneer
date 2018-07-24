import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsContainerComponent } from './settings-container/settings-container.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule,
  MatButtonModule, MatSnackBarModule, MatExpansionModule, MatCheckboxModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  ],
  declarations: [
    SettingsContainerComponent,
  ], exports: [
    SettingsContainerComponent,
  ]
})
export class SettingsModule { }
