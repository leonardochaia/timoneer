import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { TAB_DATA } from '../../tabs/tab.model';
import { JobInstance } from '../../jobs/job-instance';
import { ContainerCreationJob } from '../container-creation-job';
import { TimoneerTabs } from '../../timoneer-tabs';
import { TabService } from '../../tabs/tab.service';
import { JobRunnerService } from '../../jobs/job-runner.service';
import { Subject } from 'rxjs';

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

  private componentDestroyed = new Subject<void>();

  constructor(
    private tabService: TabService,
    private jobRunner: JobRunnerService,
    @Inject(TAB_DATA)
    private params: ContainerLauncherParams
  ) {
  }

  public ngOnInit() {

    this.job = this.jobRunner.getJobById(this.params.jobId);
    if (this.job) {
      this.job.completed
        .subscribe(containerId => {
          this.tabService.replaceCurrent(TimoneerTabs.DOCKER_ATTACH, {
            title: `Attached to ${containerId.slice(0, 12)}`,
            params: containerId,
          });
        });
    } else {
      console.error('failed to find job with id ' + this.params.jobId);
    }
  }

  public ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }
}
