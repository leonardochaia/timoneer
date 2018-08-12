import { Component, OnInit, OnDestroy, ContentChild, TemplateRef, Input } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { takeUntil, take, catchError, map } from 'rxjs/operators';
import { NotificationService } from '../../shared/notification.service';
import { ContainerInfo } from 'dockerode';
import { DockerEventsService } from '../docker-events.service';
import { DockerContainerService } from '../docker-container.service';
import { ContainerMenuService } from '../container-menu.service';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

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
    private tabService: TabService,
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

  public attach(container: ContainerInfo) {
    this.tabService.add(TimoneerTabs.DOCKER_ATTACH, {
      title: `Attached to ${container.Names[0]}`,
      params: container.Id,
    });
  }

  public exec(container: ContainerInfo) {
    this.tabService.add(TimoneerTabs.DOCKER_EXEC, {
      title: `Exec into ${container.Names[0]}`,
      params: container.Id,
    });
  }

  public start(container: ContainerInfo) {
    this.bindLoading(container, this.containerService.start(container.Id))
      .subscribe(() => {
        this.notificationService.open(`${container.Names[0]} started`);
        this.attach(container);
      });
  }

  public stop(container: ContainerInfo) {
    this.bindLoading(container, this.containerService.stop(container.Id))
      .subscribe(() => {
        this.notificationService.open(`${container.Names[0]} stopped`);
      });
  }

  public remove(container: ContainerInfo) {
    this.bindLoading(container, this.containerService.remove(container.Id))
      .subscribe(() => {
        this.notificationService.open(`${container.Names[0]} removed`);
      });
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

  private bindLoading(image: ContainerInfo, obs: Observable<any>) {
    this.loadingMap.set(image.Id, true);
    return obs.pipe(
      catchError((e) => {
        this.loadingMap.set(image.Id, false);
        this.notificationService.open(e.message, null, {
          panelClass: 'tim-bg-warn',
        });
        return throwError(e);
      }),
      map(r => {
        this.loadingMap.set(image.Id, false);
        return r;
      })
    );
  }
}
