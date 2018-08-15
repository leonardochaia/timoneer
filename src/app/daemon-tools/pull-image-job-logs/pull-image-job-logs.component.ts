import { Component, Inject } from '@angular/core';
import { DockerStreamResponse } from '../docker-client.model';
import { JobInstance } from '../../jobs/job-instance';
import { CURRENT_JOB } from '../../jobs/jobs.model';
import { PullImageJob, PullImageJobProgress } from '../pull-image.job';
import { DockerImageService } from '../docker-image.service';

@Component({
  selector: 'tim-pull-image-job-logs',
  templateUrl: './pull-image-job-logs.component.html',
  styleUrls: ['./pull-image-job-logs.component.scss']
})
export class PullImageJobLogsComponent {

  public get logs() {
    return this.job.definition.responses;
  }

  constructor(
    private imageService: DockerImageService,
    @Inject(CURRENT_JOB)
    private job: JobInstance<PullImageJob>) { }

  public trackByFn(item: DockerStreamResponse) {
    return item.id;
  }

  public isUserFriendly(progress: PullImageJobProgress) {
    return progress
      && (progress.message && !(progress.status || progress.error))
      || this.imageService.isUserFriendlyResponse(progress);
  }
}
