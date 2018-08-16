import { Component, Input } from '@angular/core';
import { JobInstance } from '../job-instance';
import { JobStatus } from '../jobs.model';

@Component({
  selector: 'tim-job-progress-bar',
  templateUrl: './job-progress-bar.component.html',
  styleUrls: ['./job-progress-bar.component.scss']
})
export class JobProgressBarComponent {

  public readonly JobStatus = JobStatus;

  @Input()
  public showMessage = false;

  @Input()
  public job: JobInstance;
}
