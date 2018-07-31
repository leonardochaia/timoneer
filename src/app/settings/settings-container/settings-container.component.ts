import { Component, OnInit, OnDestroy } from '@angular/core';
import { DockerRegistrySettings, DockerClientSettings } from '../settings.model';
import { SettingsService, TIM_LOGO } from '../settings.service';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { timoneerVersion } from '../../../tim-version';

@Component({
  selector: 'tim-settings-container',
  templateUrl: './settings-container.component.html',
  styleUrls: ['./settings-container.component.scss']
})
export class SettingsContainerComponent implements OnInit, OnDestroy {

  public registriesArray = this.fb.array([]);

  public clientGroup: FormGroup;

  public form: FormGroup;

  public get timoneerLogo() {
    return TIM_LOGO;
  }

  public get appVersion() {
    return timoneerVersion;
  }

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
        this.setClientSettings(settings.dockerClientSettings);
        this.form = this.fb.group({
          'dockerClientSettings': this.clientGroup,
          'registries': this.registriesArray
        });

        this.registriesArray.controls.splice(0, this.registriesArray.length);
        for (const registrySetting of settings.registries) {
          this.addRegistry(registrySetting);
        }
      });
  }

  public save() {
    this.settingsService.saveSettings(this.form.value)
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(() => {
        this.snackBar.open('Settings saved.', null, {
          duration: 2000,
          panelClass: 'tim-bg-accent'
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

  public getRegistryName(registry: DockerRegistrySettings) {
    return this.settingsService.getRegistryName(registry);
  }

  private setClientSettings(settings: DockerClientSettings) {
    this.clientGroup = this.fb.group({
      'fromEnvironment': [settings.fromEnvironment, Validators.required],
      'url': [settings.url || 'http://', Validators.compose([Validators.required, Validators.pattern('https|tcp|unix?://.+')])],
      'tlsVerify': [settings.tlsVerify, Validators.required],
      'certPath': [settings.certPath || ''],
    });

    const onFromEnvironmentChanged = () => {
      const value = this.clientGroup.get('fromEnvironment').value as boolean;
      const url = this.clientGroup.get('url');
      const tlsVerify = this.clientGroup.get('tlsVerify');
      const certPath = this.clientGroup.get('certPath');
      if (value) {
        url.disable();
        tlsVerify.disable();
        certPath.disable();

        const envSettings = this.settingsService.getDockerClientConfigFromEnvironment();
        url.setValue(envSettings.url);
        tlsVerify.setValue(envSettings.tlsVerify);
        certPath.setValue(envSettings.certPath);
      } else {
        url.enable();
        tlsVerify.enable();
        certPath.enable();
      }
    };

    this.clientGroup.get('fromEnvironment')
      .valueChanges
      .subscribe(() => {
        onFromEnvironmentChanged();
      });

    onFromEnvironmentChanged();
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
