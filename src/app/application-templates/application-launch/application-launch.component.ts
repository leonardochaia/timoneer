import { Component, Input } from '@angular/core';
import { Application } from '../application.model';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';
import { JobInstance } from '../../jobs/job-instance';
import { ContainerCreationJob } from '../../daemon-tools/container-creation-job';
import { ContainerLauncherParams } from '../../daemon-tools/container-launcher/container-launcher.component';

@Component({
  selector: 'tim-application-launch',
  templateUrl: './application-launch.component.html',
  styleUrls: ['./application-launch.component.scss']
})
export class ApplicationLaunchComponent {

  @Input()
  public application: Application;

  constructor(private tabService: TabService) { }

  public containerCreated(job: JobInstance<ContainerCreationJob, string>) {
    this.tabService.replaceCurrent(TimoneerTabs.DOCKER_CONTAINER_LAUNCHER, {
      params: {
        jobId: job.id,
      } as ContainerLauncherParams,
    });
  }
}
