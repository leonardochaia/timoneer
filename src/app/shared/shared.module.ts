import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { MatProgressSpinnerModule, MatSnackBarModule, MatProgressBarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BytesToHumanPipe } from './bytes-to-human.pipe';

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
    BytesToHumanPipe,
  ],
  exports: [
    LoadingComponent,
    BytesToHumanPipe,
  ]
})
export class SharedModule { }
