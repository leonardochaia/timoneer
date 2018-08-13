import { Injectable } from '@angular/core';
import { JobRunnerService } from '../jobs/job-runner.service';
import { PullImageJob, PullImageJobParams } from './pull-image.job';

@Injectable({
  providedIn: 'root'
})
export class DockerJobsService {

  constructor(private jobRunner: JobRunnerService) { }

  public pullImage(image: string) {
    const params = new PullImageJobParams(image);
    return this.jobRunner.startJob(PullImageJob, {
      provide: PullImageJobParams,
      useValue: params
    });
  }

}
