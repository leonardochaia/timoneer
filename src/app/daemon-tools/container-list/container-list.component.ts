import { Component, OnInit, OnDestroy } from '@angular/core';
import { DaemonService } from '../daemon.service';
import { ContainerSummary, ContainerSummaryInner } from 'docker-client';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../shared/notification.service';
import { MatBottomSheet } from '@angular/material';
import { ContainerActionsSheetComponent } from '../container-actions-sheet/container-actions-sheet.component';

@Component({
  selector: 'tim-container-list',
  templateUrl: './container-list.component.html',
  styleUrls: ['./container-list.component.scss']
})
export class ContainerListComponent implements OnInit, OnDestroy {
  public containers: ContainerSummary;

  public loading: boolean;

  private componetDestroyed = new Subject();

  constructor(private daemonService: DaemonService,
    private notificationService: NotificationService,
    private bottomSheet: MatBottomSheet) { }

  public ngOnInit() {
    this.loading = true;
    this.daemonService
      .containerApi(api => api.containerList())
      .pipe(
        takeUntil(this.componetDestroyed),
    ).subscribe(containers => {
      this.loading = false;
      this.containers = containers;
    }, () => {
      this.loading = false;
      this.notificationService.open('Error ocurred while obtaining containers!', null, {
        panelClass: 'mat-bg-warn'
      });
    });
  }

  public openContainerMenu(container: ContainerSummaryInner) {
    this.bottomSheet.open(ContainerActionsSheetComponent, {
      data: container
    });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
