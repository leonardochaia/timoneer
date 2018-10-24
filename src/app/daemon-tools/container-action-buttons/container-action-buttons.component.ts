import { Component, Input } from '@angular/core';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DockerContainerService } from '../docker-container.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'tim-container-action-buttons',
  templateUrl: './container-action-buttons.component.html',
  styleUrls: ['./container-action-buttons.component.scss']
})
export class ContainerActionButtonsComponent {

  @Input()
  public containerId: string;

  @Input()
  public containerState: string;

  @Input()
  public containerName: string;

  @Input()
  public hiddenButtons: string[] = [];

  public loading: boolean;

  constructor(
    private readonly tabService: TabService,
    private readonly containerService: DockerContainerService,
    private readonly notificationService: NotificationService) { }

  public attach() {
    this.tabService.add(TimoneerTabs.DOCKER_ATTACH, {
      title: `Attached to ${this.containerName}`,
      params: this.containerId,
    });
  }

  public logs() {
    this.tabService.add(TimoneerTabs.DOCKER_LOGS, {
      title: `Logs from ${this.containerName}`,
      params: this.containerId,
    });
  }

  public exec() {
    this.tabService.add(TimoneerTabs.DOCKER_EXEC, {
      title: `Exec into ${this.containerName}`,
      params: this.containerId,
    });
  }

  public start() {
    this.bindLoading(this.containerService.start(this.containerId))
      .subscribe(() => {
        this.notificationService.open(`${this.containerName} started`);
        this.attach();
      });
  }

  public stop() {
    this.bindLoading(this.containerService.stop(this.containerId))
      .subscribe(() => {
        this.notificationService.open(`${this.containerName} stopped`);
      });
  }

  public remove() {
    this.bindLoading(this.containerService.remove(this.containerId))
      .subscribe(() => {
        this.notificationService.open(`${this.containerName} removed`);
      });
  }

  public isButtonVisible(key: string) {
    return !this.hiddenButtons.includes(key);
  }

  private bindLoading(obs: Observable<any>) {
    this.loading = true;
    return obs.pipe(
      catchError((e) => {
        this.loading = false;
        this.notificationService.open(e.message, null, {
          panelClass: 'tim-bg-warn',
        });
        return throwError(e);
      }),
      map(r => {
        this.loading = false;
        return r;
      })
    );
  }
}
