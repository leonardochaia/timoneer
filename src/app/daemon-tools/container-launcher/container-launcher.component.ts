import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { TAB_DATA, Tab } from '../../tabs/tab.model';
import { JobInstance } from '../../jobs/job-instance';
import { ContainerCreationJob } from '../container-creation-job';
import { TimoneerTabs } from '../../timoneer-tabs';
import { TabService } from '../../tabs/tab.service';
import { JobRunnerService } from '../../jobs/job-runner.service';
import { Subject } from 'rxjs';
import { JobStatus } from '../../jobs/jobs.model';
import { takeUntil } from 'rxjs/operators';
import { DockerContainerService } from '../docker-container.service';
import { NotificationService } from '../../shared/notification.service';

export interface ContainerLauncherParams {
  jobId: string;
}

@Component({
  selector: 'tim-container-launcher',
  templateUrl: './container-launcher.component.html',
  styleUrls: ['./container-launcher.component.scss']
})
export class ContainerLauncherComponent implements OnInit, OnDestroy {

  public job: JobInstance<ContainerCreationJob, string>;

  public readonly JobStatus = JobStatus;

  public get autoRemove() {
    if (this.job) {
      return this.job.definition.creationData.HostConfig
        && this.job.definition.creationData.HostConfig.AutoRemove
        && this.containerId;
    } else {
      return false;
    }
  }

  public containerId: string;

  private componentDestroyed = new Subject<void>();

  constructor(
    private readonly tabService: TabService,
    private readonly jobRunner: JobRunnerService,
    private readonly containerService: DockerContainerService,
    private readonly notificationService: NotificationService,
    private readonly tab: Tab,
    @Inject(TAB_DATA)
    private readonly params: ContainerLauncherParams
  ) {
  }

  public ngOnInit() {

    this.job = this.jobRunner.getJobById(this.params.jobId);
    if (this.job) {
      this.job.completed
        .pipe(takeUntil(this.componentDestroyed))
        .subscribe(containerId => {
          this.tabService.replaceCurrent(TimoneerTabs.DOCKER_ATTACH, {
            title: `Attached to ${containerId.slice(0, 12)}`,
            params: containerId,
          });
        });

      this.job.definition.containerCreated
        .pipe(takeUntil(this.componentDestroyed))
        .subscribe(containerId => {
          this.containerId = containerId;
        });
    } else {
      console.error(`Failed to find job with id [${this.params.jobId}] Closing tab`);
      this.tabService.removeTab(this.tab);
    }
  }

  public retry() {
    this.tabService.replaceCurrent(TimoneerTabs.DOCKER_CONTAINER_NEW, {
      params: this.job.definition.creationData
    });
  }

  public deleteAndRetry() {
    if (this.containerId) {
      this.containerService
        .remove(this.containerId)
        .pipe(takeUntil(this.componentDestroyed))
        .subscribe(() => {
          this.notificationService.open(`${this.containerId} removed`);
          this.retry();
        });
    } else {
      console.error('This launcher has no container id!');
    }
  }

  public ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }
}
