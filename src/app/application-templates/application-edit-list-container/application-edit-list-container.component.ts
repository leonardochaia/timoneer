import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../application.service';
import { NotificationService } from '../../shared/notification.service';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { Application } from '../application.model';
import {
  ApplicationEditAddExternalSourceComponent
} from '../application-edit-add-external-source/application-edit-add-external-source.component';
import { MatDialog } from '@angular/material';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tim-application-edit-list-container',
  templateUrl: './application-edit-list-container.component.html',
  styleUrls: ['./application-edit-list-container.component.scss']
})
export class ApplicationEditListContainerComponent implements OnInit {

  public form = this.fb.group({
    localTemplates: [''],
    externalSources: this.fb.array([])
  });

  public get externalSourcesArray() {
    return this.form.get('externalSources') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private applications: ApplicationService,
    private notification: NotificationService) { }

  public ngOnInit() {
    this.applications.getConfig()
      .pipe(take(1))
      .subscribe(config => {
        for (const source of config.externalSources) {
          this.externalSourcesArray.push(this.createSource(source));
        }
        this.form.get('localTemplates').setValue(JSON.stringify(config.localTemplates, null, 2));
      });
  }

  public addSource() {
    const source = this.createSource();

    this.matDialog.open(ApplicationEditAddExternalSourceComponent, {
      data: source,
    }).afterClosed()
      .subscribe(newGroup => {
        if (newGroup) {
          this.externalSourcesArray.push(newGroup);
        }
      });
  }


  public save() {

    let apps: Application[];
    try {
      apps = JSON.parse(this.form.value.localTemplates);
    } catch (error) {
      this.notification.open(error.message, null, {
        panelClass: 'tim-bg-warn'
      });
    }

    this.applications.saveApplications({ localTemplates: apps, externalSources: this.form.value.externalSources })
      .subscribe(() => {
        this.notification.open('Applications saved', null, {
          panelClass: 'tim-bg-primary'
        });
      });
  }

  protected createSource(defaultSource?: { url: string }) {
    defaultSource = defaultSource || {} as any;
    return this.fb.group({
      url: [defaultSource.url || 'http://', Validators.compose([Validators.required, Validators.pattern('(http|https)://.+')])],
    });
  }

}
