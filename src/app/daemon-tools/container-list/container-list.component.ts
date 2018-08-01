import { Component, OnInit, OnDestroy } from '@angular/core';
import { DaemonService } from '../daemon.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../shared/notification.service';
import { MatBottomSheet } from '@angular/material';
import { ContainerActionsSheetComponent } from '../container-actions-sheet/container-actions-sheet.component';
import { ContainerInfo } from 'dockerode';
import { DockerEventsService } from '../docker-events.service';

@Component({
  selector: 'tim-container-list',
  templateUrl: './container-list.component.html',
  styleUrls: ['./container-list.component.scss']
})
export class ContainerListComponent implements OnInit, OnDestroy {
  public containers: ContainerInfo[];

  public loading: boolean;

  private componetDestroyed = new Subject();

  constructor(private daemonService: DaemonService,
    private daemonEvents: DockerEventsService,
    private notificationService: NotificationService,
    private bottomSheet: MatBottomSheet) { }

  public ngOnInit() {

    this.daemonEvents.bindAll(['destroy', 'start', 'stop', 'pause', 'unpause', 'restart', 'update'])
      .pipe(
        takeUntil(this.componetDestroyed)
      )
      .subscribe(() => {
        this.reload();
      });

    this.reload();
  }

  public openContainerMenu(container: ContainerInfo) {
    this.bottomSheet.open(ContainerActionsSheetComponent, {
      data: container
    });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  private reload() {
    this.loading = true;

    this.daemonService
      .docker(d => d.listContainers())
      .pipe(
        takeUntil(this.componetDestroyed)
      ).subscribe(containers => {
        this.loading = false;
        this.containers = containers;
      }, e => {
        this.loading = false;
        this.notificationService.open('Error ocurred while obtaining containers!', null, {
          panelClass: 'tim-bg-warn'
        });
        this.containers = [];
        console.error(e);
      });
  }
}
