import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../shared/notification.service';
import { MatBottomSheet } from '@angular/material';
import { VolumeInfo, } from 'dockerode';
import { DockerEventsService } from '../docker-events.service';
import { DockerVolumeService } from '../docker-volume.service';
import { VolumeActionsSheetComponent } from '../volume-actions-sheet/volume-actions-sheet.component';

@Component({
  selector: 'tim-volume-list',
  templateUrl: './volume-list.component.html',
  styleUrls: ['./volume-list.component.scss']
})
export class VolumeListComponent implements OnInit, OnDestroy {
  public volumes: VolumeInfo[];

  public loading: boolean;

  private componetDestroyed = new Subject();

  constructor(private volumeService: DockerVolumeService,
    private daemonEvents: DockerEventsService,
    private notificationService: NotificationService,
    private bottomSheet: MatBottomSheet) { }

  public ngOnInit() {

    this.daemonEvents.bindAll(['create', 'destroy'], 'volume')
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(() => {
        this.reload();
      });

    this.reload();
  }

  public openVolumeMenu(volume: VolumeInfo) {
    this.bottomSheet.open(VolumeActionsSheetComponent, {
      data: volume
    });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  private reload() {
    this.loading = true;

    this.volumeService.list()
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(volumes => {
        this.loading = false;
        this.volumes = volumes;
      }, e => {
        this.loading = false;
        this.notificationService.open('Error ocurred while obtaining volumes!', null, {
          panelClass: 'tim-bg-warn'
        });
        this.volumes = [];
        console.error(e);
      });
  }
}
