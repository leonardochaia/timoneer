import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobRunnerService } from './job-runner.service';
import { JobListComponent } from './job-list/job-list.component';
import { MatCardModule, MatIconModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    FlexLayoutModule,

  ],
  declarations: [
    JobListComponent,
  ],
  exports: [
    JobListComponent
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
