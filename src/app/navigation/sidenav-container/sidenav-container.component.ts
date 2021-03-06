import { Component } from '@angular/core';
import { UpdaterService, UpdaterStatus } from '../../electron-tools/updater.service';
import { TIM_LOGO } from '../../settings/settings.service';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';
import { JobStatus } from '../../jobs/jobs.model';

@Component({
    selector: 'tim-sidenav-container',
    templateUrl: './sidenav-container.component.html',
    styleUrls: ['./sidenav-container.component.scss']
})
export class SidenavContainerComponent {

    public UpdaterStatus = UpdaterStatus;

    public JobStatus = JobStatus;

    public get timoneerLogo() {
        return TIM_LOGO;
    }

    public get appVersion() {
        return this.updater.currentVersion;
    }

    public get updateStatusText() {
        return this.updater.statusText;
    }

    public get updateStatus() {
        return this.updater.status;
    }

    constructor(private updater: UpdaterService,
        private tabService: TabService) {
        if (!tabService.tabs.length) {
            this.openDashboard();
        }
    }

    public openSystem() {
        this.tabService.add(TimoneerTabs.DOCKER_SYSTEM);
    }

    public openContainers() {
        this.tabService.add(TimoneerTabs.DOCKER_CONTAINER_LIST);
    }

    public openDashboard() {
        this.tabService.add(TimoneerTabs.DASHBOARD);
    }

    public openApplications() {
        this.tabService.add(TimoneerTabs.APPLICATION_LIST);
    }

    public openDockerImages() {
        this.tabService.add(TimoneerTabs.DOCKER_IMAGES);
    }

    public openSettings() {
        this.tabService.add(TimoneerTabs.SETTINGS);
    }

    public openDockerVolumes() {
        this.tabService.add(TimoneerTabs.DOCKER_VOLUMES);
    }

    public attach(name: string, containerId: string) {
        this.tabService.add(TimoneerTabs.DOCKER_ATTACH, {
            title: `Attached to ${name}`,
            params: containerId,
        });
    }
}
