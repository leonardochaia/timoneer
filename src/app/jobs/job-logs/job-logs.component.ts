import { Component, Inject, Input, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { JobInstance } from '../job-instance';
import { JobStatus } from '../jobs.model';

@Component({
  selector: 'tim-job-logs',
  templateUrl: './job-logs.component.html',
  styleUrls: ['./job-logs.component.scss']
})
export class JobLogsComponent {

  public readonly JobStatus = JobStatus;

  @Input()
  public job: JobInstance<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    @Optional()
    dialogJob: JobInstance<any>
  ) {

    if (dialogJob) {
      this.job = dialogJob;
    }
  }
}
