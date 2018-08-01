import { Component, OnInit } from '@angular/core';
import { UpdaterService, UpdaterStatus } from '../../electron-tools/updater.service';

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

  constructor(private updater: UpdaterService) { }

  public ngOnInit() {
  }

  public checkForUpdates() {
    this.updater.checkForUpdates();
  }

  public downloadLatestUpdate() {
    this.updater.downloadLatestUpdate();
  }

  public quitAndInstallUpdate() {
    this.updater.quitAndInstall();
  }

}
