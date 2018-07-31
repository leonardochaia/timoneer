import { Component } from '@angular/core';
import { timoneerVersion } from '../../../tim-version';
import { UpdaterService, UpdaterStatus } from '../../electron-tools/updater.service';
import { TIM_LOGO } from '../../settings/settings.service';

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
        return timoneerVersion.version;
    }

    public get updateStatusText() {
        return this.updater.statusText;
    }

    public get updateStatus() {
        return this.updater.status;
    }

    constructor(private updater: UpdaterService) { }
}
