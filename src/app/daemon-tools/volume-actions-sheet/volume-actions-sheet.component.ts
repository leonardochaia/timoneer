import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { NotificationService } from '../../shared/notification.service';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { VolumeInfo } from 'dockerode';
import { DockerVolumeService } from '../docker-volume.service';

@Component({
  selector: 'tim-volume-actions-sheet',
  templateUrl: './volume-actions-sheet.component.html',
  styleUrls: ['./volume-actions-sheet.component.scss']
})
export class VolumeActionsSheetComponent {

  public loading: boolean;

  public error: string;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public volume: VolumeInfo,
    private bottomSheetRef: MatBottomSheetRef<VolumeActionsSheetComponent>,
    private notificationService: NotificationService,
    private volumeService: DockerVolumeService) { }

  public dismiss() {
    this.bottomSheetRef.dismiss();
  }

  public remove() {
    this.bindLoading(this.volumeService.removeVolume(this.volume.Name))
      .subscribe(() => {
        this.dismiss();
        this.notificationService.open(`Volume removed.`);
      });
  }

  private bindLoading(obs: Observable<any>) {
    this.loading = true;
    return obs.pipe(catchError((e) => {
      this.loading = false;
      this.error = e.message;
      return throwError(e);
    }));
  }
}
