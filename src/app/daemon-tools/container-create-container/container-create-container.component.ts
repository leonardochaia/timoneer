import { Component, OnInit, Inject } from '@angular/core';
import { TAB_DATA } from '../../tabs/tab.model';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';
import { ContainerCreationJob } from '../container-creation-job';
import { JobInstance } from '../../jobs/job-instance';
import { ContainerLauncherParams } from '../container-launcher/container-launcher.component';

@Component({
  selector: 'tim-container-create-container',
  templateUrl: './container-create-container.component.html',
  styleUrls: ['./container-create-container.component.scss']
})
export class ContainerCreateContainerComponent implements OnInit {

  constructor(
    private tabService: TabService,
    @Inject(TAB_DATA)
    public initialImage: string) { }

  public ngOnInit() {
  }

  public containerCreated(job: JobInstance<ContainerCreationJob, string>) {
    this.tabService.replaceCurrent(TimoneerTabs.DOCKER_CONTAINER_LAUNCHER, {
      params: {
        jobId: job.id,
      } as ContainerLauncherParams,
    });
  }
}
