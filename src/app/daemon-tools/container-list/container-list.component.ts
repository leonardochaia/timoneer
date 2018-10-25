import { Component, OnInit, OnDestroy, ContentChild, TemplateRef, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { NotificationService } from '../../shared/notification.service';
import { ContainerInfo } from 'dockerode';
import { DockerEventsService } from '../docker-events.service';
import { DockerContainerService } from '../docker-container.service';
import { ContainerMenuService } from '../container-menu.service';

@Component({
  selector: 'tim-container-list',
  templateUrl: './container-list.component.html',
  styleUrls: ['./container-list.component.scss']
})
export class ContainerListComponent implements OnInit, OnDestroy {
  public containers: ContainerInfo[];

  public loading: boolean;

  @Input()
  public all = true;

  public loadingMap = new Map<string, boolean>();

  @ContentChild(TemplateRef)
  public template: TemplateRef<any>;

  private componetDestroyed = new Subject();

  constructor(private containerService: DockerContainerService,
    private daemonEvents: DockerEventsService,
    private menuService: ContainerMenuService,
    private notificationService: NotificationService) { }

  public ngOnInit() {

    this.daemonEvents.bindAll(['destroy', 'start', 'stop', 'pause', 'unpause', 'restart', 'update'], 'container')
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(() => {
        this.reload();
      });

    this.reload();
  }

  public openContainerMenu(container: ContainerInfo) {
    const menu = this.menuService.open(container);

    menu.actionStarted
      .pipe(takeUntil(menu.actionFinished))
      .subscribe(() => {
        this.loadingMap.set(container.Id, true);
      });

    menu.actionFinished
      .pipe(take(1))
      .subscribe(() => {
        this.loadingMap.set(container.Id, false);
      });
  }

  public getPortMappings(container: ContainerInfo) {
    return container.Ports.map(p => p.PublicPort ? `${p.PublicPort}:${p.PrivatePort}` : p.PrivatePort).join('\n');
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  private reload() {
    this.loading = true;
    this.loadingMap = new Map<string, boolean>();

    this.containerService.list({ all: this.all })
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(containers => {
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
