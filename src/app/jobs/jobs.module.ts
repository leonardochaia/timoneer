import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobRunnerService } from './job-runner.service';
import { JobListComponent } from './job-list/job-list.component';
import {
  MatCardModule, MatIconModule,
  MatProgressBarModule,
  MatButtonModule, MatDialogModule,
  MatListModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JobDetailsWrapperComponent } from './job-details-wrapper/job-details-wrapper.component';
import { JobProgressBarComponent } from './job-progress-bar/job-progress-bar.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    FlexLayoutModule,

  ],
  declarations: [
    JobListComponent,
    JobDetailsWrapperComponent,
    JobProgressBarComponent,
  ],
  exports: [
    JobListComponent
  ],
  entryComponents: [
    JobDetailsWrapperComponent,
  ]
})
export class JobsModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: JobsModule,
      providers: [
        JobRunnerService
      ]
    };
  }
}
