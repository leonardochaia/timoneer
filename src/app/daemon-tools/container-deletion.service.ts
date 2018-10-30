import { Injectable } from '@angular/core';
import { DockerContainerService } from './docker-container.service';
import { NotificationService } from '../shared/notification.service';
import { TimDialogService } from '../tim-dialog/tim-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class ContainerDeletionService {

  constructor(private containerService: DockerContainerService,
    private notificationService: NotificationService,
    private timDialog: TimDialogService) { }

  public deleteContainer(id: string, state: string, name: string) {
    const isRunning = state === 'running';

    if (isRunning) {
      return this.timDialog.openMessageModal({
        title: `Force remove ${name}`,
        message: 'The container is running and must be forced to be removed.',
        confirmButton: {
          color: 'warn',
          icon: 'delete',
          text: 'Force Removal',
          action: () => {
            this.internalDeleteContainer(id, name, true);
          }
        }
      }).afterClosed();
    } else {
      return this.internalDeleteContainer(id, name);
    }
  }

  protected internalDeleteContainer(id: string, name: string, force = false) {
    const obs = this.containerService.remove(id, {
      force: force
    });
    obs.subscribe(() => {
      this.notificationService.open(`${name} has been removed`);
    });
    return obs;
  }
}
