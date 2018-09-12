import { Component, OnInit } from '@angular/core';
import { UpdaterService, UpdaterStatus } from '../../electron-tools/updater.service';
import { JobRunnerService } from '../../jobs/job-runner.service';
import { TimoneerUpdateJob } from '../../electron-tools/timoneer-update.job';

@Component({
  selector: 'tim-settings-updater',
  templateUrl: './settings-updater.component.html',
  styleUrls: ['./settings-updater.component.scss']
})
export class SettingsUpdaterComponent implements OnInit {

  public UpdaterStatus = UpdaterStatus;

  public get updateStatus() {
    return this.updater.status;
  }

  public get updateDownloadProgress() {
    return this.updater.currentDownloadProgress;
  }

  public get currentUpdate() {
    return this.updater.latestVersion;
  }

  constructor(private updater: UpdaterService,
    private jobRunner: JobRunnerService) { }

  public ngOnInit() {
  }

  public checkForUpdates() {
    this.jobRunner.startJob(TimoneerUpdateJob);
  }

  public quitAndInstallUpdate() {
    this.updater.quitAndInstall();
  }

}
