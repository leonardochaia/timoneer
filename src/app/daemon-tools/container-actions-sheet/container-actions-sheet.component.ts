import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { NotificationService } from '../../shared/notification.service';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ContainerInfo } from 'dockerode';
import { DockerContainerService } from '../docker-container.service';
import { TimoneerTabsService } from '../../navigation/timoneer-tabs.service';

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
    private containerService: DockerContainerService,
    private tabService: TimoneerTabsService) { }

  public dismiss() {
    this.bottomSheetRef.dismiss();
  }

  public stop() {
    this.bindLoading(this.containerService.stop(this.container.Id))
      .subscribe(() => {
        this.dismiss();
        this.notificationService.open(`Container stopped.`);
      });
  }

  public remove() {
    this.bindLoading(this.containerService.remove(this.container.Id, { force: true }))
      .subscribe(() => {
        this.dismiss();
        this.notificationService.open(`Container removed.`);
      });
  }

  public attach() {
    this.dismiss();
    this.tabService.attach(this.container.Id);
  }

  public exec() {
    this.dismiss();
    this.tabService.exec(this.container.Id);
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
