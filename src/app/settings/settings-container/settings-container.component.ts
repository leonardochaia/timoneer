import { Component, OnInit, OnDestroy } from '@angular/core';
import { DockerRegistrySettings } from '../settings.model';
import { SettingsService } from '../settings.service';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms';
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

  public createRegistry() {
    const group = this.createRegistryGroup();
    this.settingsService.openRegistrySettingsDialog(group)
      .afterClosed().subscribe(newGroup => {
        if (newGroup) {
          this.registriesArray.push(newGroup);
        }
      });
  }

  public editRegistry(group: FormGroup) {
    const index = this.registriesArray.controls.indexOf(group);
    const clone = this.createRegistryGroup(group.getRawValue());
    this.settingsService.openRegistrySettingsDialog(clone)
      .afterClosed().subscribe(newGroup => {
        if (newGroup) {
          this.registriesArray.setControl(index, newGroup);
        }
      });
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

  public getRegistryFromGroup(group: AbstractControl) {
    return (group as FormGroup).getRawValue() as DockerRegistrySettings;
  }

  private createRegistryGroup(registrySettings?: DockerRegistrySettings) {
    registrySettings = registrySettings || {
      url: 'https://',
      username: '',
      password: '',
      allowsCatalog: true,
      editable: true,
    };
    return this.fb.group({
      'url': [{ value: registrySettings.url, disabled: !registrySettings.editable },
      Validators.compose([Validators.required, Validators.pattern('https?://.+')])],
      'username': [registrySettings.username],
      'password': [registrySettings.password],
      'allowsCatalog': [{ value: registrySettings.allowsCatalog, disabled: !registrySettings.editable }, Validators.required],
      'editable': [registrySettings.editable, Validators.required],
    });
  }

  private addRegistry(registrySettings?: DockerRegistrySettings) {
    const group = this.createRegistryGroup(registrySettings);
    this.registriesArray.push(group);
    return group;
  }
}
