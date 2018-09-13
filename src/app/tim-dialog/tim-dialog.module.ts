import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatButtonModule, MatIconModule, MatInputModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TimDialogRendererComponent } from './tim-dialog-renderer/tim-dialog-renderer.component';
import { TimDialogService } from './tim-dialog.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FlexLayoutModule,
  ],
  declarations: [
    TimDialogRendererComponent
  ],
  entryComponents: [
    TimDialogRendererComponent,
  ],
  providers: [
    TimDialogService,
  ]
})
export class TimDialogModule { }
