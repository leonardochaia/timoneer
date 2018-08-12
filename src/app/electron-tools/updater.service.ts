import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { UpdateInfo } from 'electron-updater';
import { ElectronService } from './electron.service';
import { NotificationService } from '../shared/notification.service';

export enum UpdaterStatus {
  CheckingForUpdate = 1,
  Outdated,
  UpToDate,
  Downloading,
  PendingInstall
}

@Injectable({
  providedIn: 'root'
})
export class UpdaterService implements OnDestroy {

  public statusText: string;

  public status: UpdaterStatus;

  public latestVersion: UpdateInfo;

  public currentDownloadProgress: any;

  public get currentVersion() {
    return this.autoUpdater.currentVersion;
  }

  private get autoUpdater() {
    return this.electronService.electronUpdater.autoUpdater;
  }

  constructor(private electronService: ElectronService,
    private notificationService: NotificationService,
    private zone: NgZone) {

    this.autoUpdater.allowPrerelease = true;
    this.autoUpdater.fullChangelog = true;
    this.autoUpdater.logger = console;
    this.autoUpdater.autoDownload = false;

    // HMR support.
    this.autoUpdater.removeAllListeners();

    this.autoUpdater.on('checking-for-update', () => {
      this.zone.run(() => {
        this.onCheckingForUpdates();
      });
    });

    this.autoUpdater.on('update-available', (info: UpdateInfo) => {
      this.zone.run(() => {
        this.onUpdateAvailable(info);
      });
    });

    this.autoUpdater.on('update-not-available', (info: UpdateInfo) => {
      this.zone.run(() => {
        this.onUpdateNotAvailable(info);
      });
    });

    this.autoUpdater.on('error', (error) => {
      this.zone.run(() => {
        this.onUpdateError(error);
      });
    });

    this.autoUpdater.on('download-progress', (progressObj) => {
      this.zone.run(() => {
        this.onDownloadProgress(progressObj);
      });
    });

    this.autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
      this.zone.run(() => {
        this.onUpdateDownloaded(info);
      });
    });

    this.checkForUpdates();
  }

  public checkForUpdates() {
    this.autoUpdater.checkForUpdates();
  }

  public downloadLatestUpdate() {
    if (this.status === UpdaterStatus.Outdated) {
      this.status = UpdaterStatus.Downloading;
      this.autoUpdater.downloadUpdate();

      this.notificationService.open(`Downloading Latest Timoneer Version..`);
    }
  }

  public ngOnDestroy() {
    // HMR support.
    this.autoUpdater.removeAllListeners();
  }

  public quitAndInstall() {
    this.autoUpdater.quitAndInstall();
  }

  protected onCheckingForUpdates() {
    this.statusText = 'Checking for updates..';
    this.status = UpdaterStatus.CheckingForUpdate;
  }

  protected onUpdateAvailable(info: UpdateInfo) {
    this.statusText = `v${info.version} is available.`;
    this.latestVersion = info;
    this.status = UpdaterStatus.Outdated;
  }

  protected onUpdateNotAvailable(info: UpdateInfo) {
    this.statusText = `Up to date`;
    this.latestVersion = info;
    this.status = UpdaterStatus.UpToDate;
  }

  protected onUpdateError(error: Error) {
    this.statusText = `Error while checking for updates: ${error.message}`;
  }

  protected onDownloadProgress(progress: {
    progress: any, percent: number,
    bytesPerSecond: number, total: number, transferred: number
  }) {
    this.status = UpdaterStatus.Downloading;
    this.currentDownloadProgress = progress;
    this.statusText = `Downloading.. %${progress.percent}`;
    console.log(progress);
  }

  protected onUpdateDownloaded(info: UpdateInfo) {
    this.currentDownloadProgress = null;
    this.status = UpdaterStatus.PendingInstall;
    this.statusText = `v${info.version} is ready to be installed.`;

    this.notificationService.open(`Timoneer v${info.version} finished downloading. Restart to install`, 'Restart', {
      duration: -1
    }).onAction().subscribe(() => {
      this.quitAndInstall();
    });
  }
}
