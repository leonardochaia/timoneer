import { Component, OnInit } from '@angular/core';
import { JobRunnerService } from '../job-runner.service';
import { JobStatus } from '../jobs.model';
import { JobInstance } from '../job-instance';
import { JobDetailsService } from '../job-details.service';
import { TestJob } from '../test.job';
import { ContextMenuService, ContextMenuConstructor } from '../../electron-tools/context-menu.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'tim-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  public JobStatus = JobStatus;

  public get jobs() {
    return this.jobRunner.jobs.filter(j => j.status === JobStatus.Running);
  }

  constructor(private jobRunner: JobRunnerService,
    private menu: ContextMenuService,
    private notification: NotificationService,
    private jobDetails: JobDetailsService) { }

  public ngOnInit() {
    this.jobRunner.startJob(TestJob);
  }

  public restartJob(job: JobInstance<any>) {
    this.jobRunner.restartJob(job);
  }

  public showDetails(job: JobInstance<any>) {
    this.jobDetails.openDetailsModal(job);
  }

  public showMenu(job: JobInstance<any>) {
    const templates: ContextMenuConstructor[] = [
      {
        label: 'Cancel',
        click: () => {
          job.cancel();
          this.notification.open(`${job.definition.title} cancelled.`);
        }
      }
    ];
    this.menu.open(templates);
  }
}
