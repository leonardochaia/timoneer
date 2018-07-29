import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { MatProgressSpinnerModule, MatSnackBarModule, MatProgressBarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,

    MatSnackBarModule,

    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  declarations: [
    LoadingComponent,
  ],
  exports: [
    LoadingComponent,
  ]
})
export class SharedModule { }
