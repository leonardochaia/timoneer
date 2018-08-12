import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { takeUntil, catchError, map } from 'rxjs/operators';
import { NotificationService } from '../../shared/notification.service';
import { VolumeInfo, ContainerInfo, } from 'dockerode';
import { DockerEventsService } from '../docker-events.service';
import { DockerVolumeService } from '../docker-volume.service';
import { DockerContainerService } from '../docker-container.service';

@Component({
  selector: 'tim-volume-list',
  templateUrl: './volume-list.component.html',
  styleUrls: ['./volume-list.component.scss']
})
export class VolumeListComponent implements OnInit, OnDestroy {
  public volumes: VolumeInfo[];

  public containers = new Map<string, ContainerInfo[]>();

  public loading: boolean;

  public loadingMap = new Map<string, boolean>();

  private componetDestroyed = new Subject();

  constructor(private volumeService: DockerVolumeService,
    private containerService: DockerContainerService,
    private daemonEvents: DockerEventsService,
    private notificationService: NotificationService) { }

  public ngOnInit() {

    this.daemonEvents.bindAll(['create', 'destroy'], 'volume')
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(() => {
        this.reload();
      });

    this.reload();
  }

  public deleteVolume(volume: VolumeInfo) {
    this.bindLoading(volume, this.volumeService.removeVolume(volume.Name))
      .subscribe(() => {
        this.notificationService.open(`${volume.Name} has been removed.`);
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  public getContainersUsingVolume(volume: VolumeInfo) {
    return this.containerService.list({
      all: true,
      filters: {
        volume: [volume.Name]
      }
    });
  }

  private bindLoading(volume: VolumeInfo, obs: Observable<any>) {
    this.loadingMap.set(volume.Name, true);
    return obs.pipe(
      catchError((e) => {
        this.loadingMap.set(volume.Name, false);
        this.notificationService.open(e.message, null, {
          panelClass: 'tim-bg-warn',
        });
        return throwError(e);
      }),
      map(r => {
        this.loadingMap.set(volume.Name, false);
        return r;
      })
    );
  }

  private reload() {
    this.loading = true;

    this.volumeService.list()
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(volumes => {
        this.loading = false;
        this.volumes = volumes;
        for (const volume of volumes) {
          this.getContainersUsingVolume(volume).subscribe(containers => {
            this.containers.set(volume.Name, containers);
          });
        }
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
