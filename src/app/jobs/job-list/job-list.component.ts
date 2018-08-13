import { Component, OnInit } from '@angular/core';
import { JobRunnerService } from '../job-runner.service';
import { JobStatus } from '../jobs.model';
import { JobInstance } from '../job-instance';

@Component({
  selector: 'tim-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  public JobStatus = JobStatus;

  public get jobs() {
    return this.jobRunner.jobs;
  }

  constructor(private jobRunner: JobRunnerService) { }

  public ngOnInit() {
  }

  public restartJob(job: JobInstance<any>) {
    this.jobRunner.restartJob(job);
  }
}
