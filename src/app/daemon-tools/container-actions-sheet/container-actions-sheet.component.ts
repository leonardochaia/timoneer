import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { DaemonService } from '../daemon.service';
import { NotificationService } from '../../shared/notification.service';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ContainerInfo } from 'dockerode';

@Component({
  selector: 'tim-container-actions-sheet',
  templateUrl: './container-actions-sheet.component.html',
  styleUrls: ['./container-actions-sheet.component.scss']
})
export class ContainerActionsSheetComponent {

  public loading: boolean;

  public error: string;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public container: ContainerInfo,
    private bottomSheetRef: MatBottomSheetRef<ContainerActionsSheetComponent>,
    private notificationService: NotificationService,
    private daemonService: DaemonService) { }

  public dismiss() {
    this.bottomSheetRef.dismiss();
  }

  public stop() {
    this.loading = true;
    this.bindLoading(
      this.daemonService.docker(d => d.getContainer(this.container.Id).stop()))
      .subscribe(() => {
        this.dismiss();
        this.notificationService.open(`Container stopped.`);
      });
  }

  public remove() {
    this.bindLoading(
      this.daemonService.docker(d => d.getContainer(this.container.Id).remove({ force: true })))
      .subscribe(() => {
        this.dismiss();
        this.notificationService.open(`Container removed.`);
      });
  }

  private bindLoading(obs: Observable<any>) {
    return obs.pipe(catchError((e) => {
      this.loading = false;
      this.error = e.message;
      return throwError(e);
    }));
  }
}
