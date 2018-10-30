import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { DockerHubService } from '../../docker-hub/docker-hub.service';
import { NotificationService } from '../../shared/notification.service';
import { RegistryService } from '../../registry/registry.service';
import { Observable, throwError, of } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DockerRegistrySettings } from '../settings.model';

@Component({
  selector: 'tim-registry-settings-modal',
  templateUrl: './registry-settings-modal.component.html',
  styleUrls: ['./registry-settings-modal.component.scss']
})
export class RegistrySettingsModalComponent implements OnInit {

  public loading: boolean;

  constructor(
    private dialogRef: MatDialogRef<RegistrySettingsModalComponent>,
    private dockerHub: DockerHubService,
    private registry: RegistryService,
    private notification: NotificationService,
    @Inject(MAT_DIALOG_DATA)
    public registryFormGroup: FormGroup) { }

  public ngOnInit() {
  }

  public confirm() {
    this.loading = true;
    this.registryFormGroup.disable();
    let obs: Observable<any>;

    const registrySettings = this.registryFormGroup.getRawValue() as DockerRegistrySettings;

    if (registrySettings.isDockerHub) {
      const username = registrySettings.username;
      const password = registrySettings.password;
      if (username) {
        obs = this.dockerHub.logIn(username, password)
          .pipe(catchError((error: HttpErrorResponse) => {
            this.notification.open(error.error.detail || error.message, null, {
              panelClass: 'tim-bg-warn'
            });
            return throwError(error);
          }));
      } else {
        obs = of(null);
      }
    } else {
      obs = this.registry.testRegistrySettings(registrySettings)
        .pipe(catchError((error: HttpErrorResponse) => {
          this.notification.open(error.error || error.message, null, {
            panelClass: 'tim-bg-warn'
          });
          return throwError(error);
        }));
    }

    obs
      .pipe(take(1))
      .subscribe(() => {
        this.registryFormGroup.enable();
        this.dialogRef.close(this.registryFormGroup);
        this.notification.open('Login succeded', null, {
          panelClass: 'tim-bg-primary'
        });
      }, error => {
        this.loading = false;
        this.registryFormGroup.enable();

        if (this.registryFormGroup.value.isDockerHub) {
          this.registryFormGroup.get('url').disable();
        }

        console.error(error);
      });
  }
}
