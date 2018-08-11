import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { NotificationService } from '../../shared/notification.service';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ImageInfo } from 'dockerode';
import { TabService } from '../../tabs/tab.service';
import { DockerImageService } from '../docker-image.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-image-actions-sheet',
  templateUrl: './image-actions-sheet.component.html',
  styleUrls: ['./image-actions-sheet.component.scss']
})
export class ImageActionsSheetComponent {

  public loading: boolean;

  public error: string;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public image: ImageInfo,
    private bottomSheetRef: MatBottomSheetRef<ImageActionsSheetComponent>,
    private notificationService: NotificationService,
    private imageService: DockerImageService,
    private tabService: TabService) { }

  public dismiss() {
    this.bottomSheetRef.dismiss();
  }

  public remove() {
    this.bindLoading(this.imageService.removeImage(this.image.Id))
      .subscribe(() => {
        this.dismiss();
        this.notificationService.open(`Image removed.`);
      });
  }

  public createContainer() {
    this.dismiss();
    this.tabService.add(TimoneerTabs.DOCKER_CONTAINER_NEW, {
      params: this.image.RepoTags[0] || this.image.Id
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
