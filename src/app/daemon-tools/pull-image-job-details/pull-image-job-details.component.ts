import { Component, Inject } from '@angular/core';
import { DockerStreamResponse } from '../docker-client.model';
import { JobInstance } from '../../jobs/job-instance';
import { JOB_DETAILS_JOB } from '../../jobs/jobs.model';
import { PullImageJob } from '../pull-image.job';

@Component({
  selector: 'tim-pull-image-job-details',
  templateUrl: './pull-image-job-details.component.html',
  styleUrls: ['./pull-image-job-details.component.scss']
})
export class PullImageJobDetailsComponent {

  public get logs() {
    return this.job.definition.responses;
  }

  constructor(
    @Inject(JOB_DETAILS_JOB)
    private job: JobInstance<PullImageJob>) { }

  public trackByFn(item: DockerStreamResponse) {
    return item.id;
  }
}
