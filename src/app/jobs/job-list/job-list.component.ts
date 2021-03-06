import { Component, OnInit, Input } from '@angular/core';
import { JobRunnerService } from '../job-runner.service';
import { JobStatus } from '../jobs.model';
import { JobInstance } from '../job-instance';
import { JobDetailsService } from '../job-details.service';
import { ContextMenuService, ContextMenuConstructor } from '../../electron-tools/context-menu.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'tim-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  public JobStatus = JobStatus;

  @Input()
  public jobs: JobInstance[];

  @Input()
  public status: JobStatus;

  public get filteredJobs() {
    if (this.status) {
      return this.jobRunner.jobs.filter(j => j.status === this.status);
    } else {
      return this.jobRunner.jobs;
    }
  }

  constructor(private jobRunner: JobRunnerService,
    private menu: ContextMenuService,
    private notification: NotificationService,
    private jobDetails: JobDetailsService) { }

  public ngOnInit() {
  }

  public restartJob(job: JobInstance<any>) {
    this.jobRunner.restartJob(job);
  }

  public showDetails(job: JobInstance<any>) {
    this.jobDetails.openDetailsModal(job);
  }

  public showMenu(job: JobInstance<any>) {
    const templates: ContextMenuConstructor[] = [];
    if (job.status === JobStatus.Running) {
      templates.push({
        label: 'Cancel',
        click: () => {
          job.cancel();
          this.notification.open(`${job.definition.title} cancelled.`);
        }
      });
    } else {
      templates.push({
        label: 'Restart',
        click: () => {
          this.jobRunner.restartJob(job);
        }
      });
    }
    this.menu.open(templates);
  }
}
