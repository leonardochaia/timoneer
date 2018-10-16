import { Injectable } from '@angular/core';
import { JobRunnerService } from '../jobs/job-runner.service';
import { PullImageJob, PullImageJobParams, PullImageJobProgress } from './pull-image.job';
import { ContainerCreateBody } from '../../../node_modules/@types/dockerode';
import { ContainerCreationJobParams, ContainerCreationJob } from './container-creation-job';
import { JobProgress } from '../jobs/jobs.model';
import { JobDetailsService } from '../jobs/job-details.service';

@Injectable({
  providedIn: 'root'
})
export class DockerJobsService {

  constructor(
    private jobRunner: JobRunnerService,
    private jobDetails: JobDetailsService) { }

  public pullImage(image: string, openDetails = true) {
    if (!image.includes(':')) {
      image += ':latest';
    }
    const params = new PullImageJobParams(image);
    const job = this.jobRunner.startJob<PullImageJob, void, PullImageJobProgress>(PullImageJob, {
      provide: PullImageJobParams,
      useValue: params
    });

    if (openDetails) {
      this.jobDetails.openDetailsModal(job);
    }

    return job;
  }

  public createContainer(creationData: ContainerCreateBody) {
    const params = new ContainerCreationJobParams(creationData);
    return this.jobRunner.startJob<ContainerCreationJob, string, JobProgress>(ContainerCreationJob, {
      provide: ContainerCreationJobParams,
      useValue: params
    });
  }

}
