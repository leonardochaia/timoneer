import { Injectable } from '@angular/core';
import { JobRunnerService } from '../jobs/job-runner.service';
import { PullImageJob, PullImageJobParams, PullImageJobProgress } from './pull-image.job';
import { ContainerCreateBody } from '../../../node_modules/@types/dockerode';
import { ContainerCreationJobParams, ContainerCreationJob } from './container-creation-job';
import { JobProgress } from '../jobs/jobs.model';

@Injectable({
  providedIn: 'root'
})
export class DockerJobsService {

  constructor(private jobRunner: JobRunnerService) { }

  public pullImage(image: string) {
    const params = new PullImageJobParams(image);
    return this.jobRunner.startJob<PullImageJob, void, PullImageJobProgress>(PullImageJob, {
      provide: PullImageJobParams,
      useValue: params
    });
  }

  public createContainer(creationData: ContainerCreateBody) {
    const params = new ContainerCreationJobParams(creationData);
    return this.jobRunner.startJob<ContainerCreationJob, string, JobProgress>(ContainerCreationJob, {
      provide: ContainerCreationJobParams,
      useValue: params
    });
  }

}
