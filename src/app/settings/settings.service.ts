import { Injectable } from '@angular/core';
import { ApplicationSettings, DockerRegistrySettings, DockerClientSettings } from './settings.model';
import { of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { RegistrySettingsModalComponent } from './registry-settings-modal/registry-settings-modal.component';
import { FormGroup } from '@angular/forms';
import { ElectronService } from '../electron-tools/electron.service';
import * as ElectronSettings from 'electron-settings';

const SETTINGS_KEY = 'app-settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settingsSubject = new BehaviorSubject<ApplicationSettings>(null);

  private get electronSettings() {
    return this.electronService.remote.require('electron-settings') as typeof ElectronSettings;
  }

  constructor(public matDialog: MatDialog,
    private electronService: ElectronService) { }

  public saveSettings(settings: ApplicationSettings) {
    this.electronSettings.set(SETTINGS_KEY, settings as any);
    this.settingsSubject.next(settings);
    return of(settings);
  }

  public getSettings() {
    if (!this.settingsSubject.value) {
      if (this.electronSettings.has(SETTINGS_KEY)) {
        const fromLocal = this.electronSettings.get(SETTINGS_KEY) as any as ApplicationSettings;
        this.settingsSubject.next(fromLocal);
      } else {
        this.settingsSubject.next(<ApplicationSettings>{
          registries: [{
            url: 'https://docker.io/',
            allowsCatalog: false,
            editable: false,
          }],
          dockerClientSettings: {
            fromEnvironment: true,
          }
        });
      }
    }

    return this.settingsSubject.asObservable()
      .pipe(map(settings => {
        if (settings.dockerClientSettings) {
          const clientSettings = settings.dockerClientSettings;
          if (clientSettings.fromEnvironment) {
            settings.dockerClientSettings = this.getDockerClientConfigFromEnvironment();
          } else {
            if (settings.dockerClientSettings.url && settings.dockerClientSettings.url.endsWith('/')) {
              settings.dockerClientSettings.url.slice(settings.dockerClientSettings.url.length - 1);
            }
          }
        } else {
          settings.dockerClientSettings = {
            fromEnvironment: true
          };
        }

        if (settings.registries && settings.registries.length) {
          for (const registry of settings.registries) {
            if (registry.url) {
              registry.url = this.ensureEndingSlash(registry.url);
            }
          }
        }
        return settings;
      }));
  }

  public areDaemonSettingsValid() {
    return this.getSettings()
      .pipe(map(settings => settings.dockerClientSettings))
      .pipe(map(settings => settings && !!settings.url));
  }

  public hasAnyRegistry() {
    return this.getSettings()
      .pipe(map(settings => settings && settings.registries && !!settings.registries.length));
  }

  public getRegistrySettingsForUrl(url: string) {
    return this.getSettings()
      .pipe(map(settings =>
        settings.registries.filter(x => url.includes(x.url))[0]
      ));
  }

  public getRegistrySettingsForImage(image: string) {
    if (image.includes('/')) {
      return this.getSettings()
        .pipe(map(settings =>
          settings.registries.filter(x => image.includes(this.getRegistryName(x)))[0]
        ));
    } else {
      return this.getDockerIOSettings();
    }
  }

  public getRegistrySettingsForName(name: string) {
    return this.getSettings()
      .pipe(
        map(settings => settings.registries.filter(x => x.url.includes(name))[0])
      );
  }

  public getRegistryAuthForImage(image: string) {
    return this.getRegistrySettingsForImage(image)
      .pipe(map(settings => this.getRegistryAuth(settings)));
  }

  public getRegistryAuthForUrl(url: string) {
    return this.getRegistrySettingsForUrl(url)
      .pipe(map(settings => this.getRegistryAuth(settings)));
  }

  public getRegistryAuth(settings: DockerRegistrySettings) {
    if (!settings) {
      return null;
    }
    const auth = JSON.stringify({
      Username: settings.username, Password: settings.password
    });
    return btoa(auth);
  }

  public getRegistryName(settings: DockerRegistrySettings) {
    return settings.url.replace('https://', '').replace('http://', '');
  }

  public getDockerIOSettings() {
    return this.getSettings()
      .pipe(
        map(settings => settings.registries[0]),
    );
  }

  public openRegistrySettingsDialog(registryFormGroup: FormGroup) {
    return this.matDialog.open(RegistrySettingsModalComponent, {
      data: registryFormGroup,
    });
  }

  public getDockerClientConfigFromEnvironment(): DockerClientSettings {
    return {
      fromEnvironment: true,
      url: process.env.DOCKER_HOST,
      tlsVerify: process.env.DOCKER_TLS_VERIFY === '1',
      certPath: process.env.DOCKER_CERT_PATH,
    };
  }

  private ensureEndingSlash(str: string) {
    if (!str.endsWith('/')) {
      return str + '/';
    } else {
      return str;
    }
  }
}
