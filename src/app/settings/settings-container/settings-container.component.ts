import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApplicationSettings, DockerRegistrySettings } from '../settings.model';
import { SettingsService } from '../settings.service';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tim-settings-container',
  templateUrl: './settings-container.component.html',
  styleUrls: ['./settings-container.component.scss']
})
export class SettingsContainerComponent implements OnInit, OnDestroy {

  public registriesArray = this.fb.array([]);

  public daemonGroup = this.fb.group({
    'url': ['http://', Validators.compose([Validators.required, Validators.pattern('https?://.+')])],
  });

  public form = this.fb.group({
    'dockerDaemonSettings': this.daemonGroup,
    'registries': this.registriesArray
  });

  private componetDestroyed = new Subject();

  constructor(private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
  }

  public addRegistry(registrySettings: DockerRegistrySettings) {
    registrySettings = registrySettings || {
      url: 'http://',
      username: '',
      password: '',
      allowsCatalog: true,
      editable: true,
    };
    const ctrl = this.fb.group({
      'url': [{ value: registrySettings.url, disabled: !registrySettings.editable },
      Validators.compose([Validators.required, Validators.pattern('https?://.+')])],
      'username': [registrySettings.username],
      'password': [registrySettings.password],
      'allowsCatalog': [{ value: registrySettings.allowsCatalog, disabled: !registrySettings.editable }, Validators.required],
      'editable': [registrySettings.editable, Validators.required],
    });
    this.registriesArray.push(ctrl);
    return ctrl;
  }

  public removeRegistry(registry: AbstractControl) {
    this.registriesArray.removeAt(this.registriesArray.controls.indexOf(registry));
  }

  public canAddRegistry() {
    return !this.registriesArray.length || !this.registriesArray.controls.some(c => c.invalid);
  }

  public ngOnInit() {
    this.settingsService.getSettings()
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(settings => {
        if (settings.dockerDaemonSettings) {
          if (settings.dockerDaemonSettings.url) {
            this.daemonGroup.get('url').setValue(settings.dockerDaemonSettings.url);
          }
        }
        this.registriesArray.controls.splice(0, this.registriesArray.length);
        for (const registrySetting of settings.registries) {
          this.addRegistry(registrySetting);
        }
      });
  }

  public save() {
    this.settingsService.saveSettings(this.form.getRawValue())
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(() => {
        this.snackBar.open('Settings saved.', null, {
          duration: 2000,
          panelClass: 'mat-bg-accent'
        });
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
