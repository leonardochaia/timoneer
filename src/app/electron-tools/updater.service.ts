import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { UpdateInfo, CancellationToken } from 'electron-updater';
import { ElectronService } from './electron.service';
import { NotificationService } from '../shared/notification.service';
import { ProgressInfo } from 'builder-util-runtime';
import { BehaviorSubject } from 'rxjs';

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

  public get currentDownloadProgress() {
    return this.progressSubject.value;
  }

  public get downloadProgress() {
    return this.progressSubject.asObservable();
  }

  public get currentVersion() {
    return this.autoUpdater.currentVersion;
  }

  private get autoUpdater() {
    return this.electronService.electronUpdater.autoUpdater;
  }

  private progressSubject = new BehaviorSubject<ProgressInfo>(null);

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

    this.autoUpdater.on('download-progress', (progressObj: ProgressInfo) => {
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
    return this.autoUpdater.checkForUpdates();
  }

  public downloadLatestUpdate(cancellationToken?: CancellationToken) {
    if (this.status === UpdaterStatus.Outdated) {
      this.status = UpdaterStatus.Downloading;
      this.notificationService.open(`Downloading Latest Timoneer Version..`);

      if (cancellationToken) {
        return this.autoUpdater.downloadUpdate(cancellationToken);
      } else {
        return this.autoUpdater.downloadUpdate();
      }
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

  protected onDownloadProgress(progress: ProgressInfo) {
    this.status = UpdaterStatus.Downloading;
    this.progressSubject.next(progress);
    this.statusText = `Downloading.. %${progress.percent}`;
  }

  protected onUpdateDownloaded(info: UpdateInfo) {
    this.status = UpdaterStatus.PendingInstall;
    this.statusText = `v${info.version} is ready to be installed.`;

    this.notificationService.open(`Timoneer ${this.statusText}`, 'Restart and Install', {
      duration: -1
    }).onAction().subscribe(() => {
      this.quitAndInstall();
    });
  }
}
