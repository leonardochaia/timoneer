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

// tslint:disable-next-line:max-line-length
export const TIM_LOGO = 'data:image/png;base64,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';

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
        map(settings => settings.registries.filter(x => x.url && x.url.includes(name))[0])
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
    return settings.url ? settings.url.replace('https://', '').replace('http://', '') : 'Docker Hub';
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
