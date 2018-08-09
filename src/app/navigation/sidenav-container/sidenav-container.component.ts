import { Component } from '@angular/core';
import { UpdaterService, UpdaterStatus } from '../../electron-tools/updater.service';
import { TIM_LOGO } from '../../settings/settings.service';
import { TimoneerTabsService } from '../timoneer-tabs.service';
import { HomeContainerComponent } from '../../home/home-container/home-container.component';
import { TabService } from '../tab.service';

@Component({
    selector: 'tim-sidenav-container',
    templateUrl: './sidenav-container.component.html',
    styleUrls: ['./sidenav-container.component.scss']
})
export class SidenavContainerComponent {

    public UpdaterStatus = UpdaterStatus;

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
        private tabService: TabService,
        private timoneerTabs: TimoneerTabsService) {
        this.openDashboard();
    }

    public openSystem() {
        this.timoneerTabs.openSystem();
    }

    public openDashboard() {
        this.tabService.addTab({
            title: 'Dashboard',
            component: HomeContainerComponent,
        });
    }

    public openApplications() {
        this.timoneerTabs.openApplications();
    }

    public openDockerImages() {
        this.timoneerTabs.openDockerImages();
    }

    public openSettings() {
        this.timoneerTabs.openSettings();
    }
}
