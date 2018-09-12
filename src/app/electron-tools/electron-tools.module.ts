import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobRunnerService } from '../jobs/job-runner.service';
import { TimoneerUpdateJob } from './timoneer-update.job';
import { JobsModule } from '../jobs/jobs.module';
import { NgMathPipesModule } from 'angular-pipes';

@NgModule({
  imports: [
    CommonModule,

    JobsModule,
    NgMathPipesModule,
  ],
  declarations: []
})
export class ElectronToolsModule {

  constructor(jobRunner: JobRunnerService) {
    jobRunner.startJob(TimoneerUpdateJob);
  }
}
