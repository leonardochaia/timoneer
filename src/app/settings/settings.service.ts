import { Injectable } from '@angular/core';
import { ApplicationSettings, DockerRegistrySettings } from './settings.model';
import { of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

const SETTINGS_KEY = 'registry-ui-settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settingsSubject = new BehaviorSubject<ApplicationSettings>(null);

  public saveSettings(settings: ApplicationSettings) {
    const json = JSON.stringify(settings);
    localStorage.setItem(SETTINGS_KEY, json);
    this.settingsSubject.next(settings);
    return of(settings);
  }

  public getSettings() {
    if (!this.settingsSubject.value) {
      const json = localStorage.getItem(SETTINGS_KEY);
      if (json) {
        const fromLocal = JSON.parse(json) as ApplicationSettings;
        this.settingsSubject.next(fromLocal);
      } else {
        this.settingsSubject.next(<ApplicationSettings>{
          registries: [{
            url: 'https://docker.io/',
            allowsCatalog: false,
            editable: false,
          }],
          dockerDaemonSettings: {}
        });
      }
    }

    return this.settingsSubject.asObservable()
      .pipe(map(settings => {
        if (settings && settings.dockerDaemonSettings && settings.dockerDaemonSettings.url) {
          if (settings.dockerDaemonSettings.url.endsWith('/')) {
            settings.dockerDaemonSettings.url.slice(settings.dockerDaemonSettings.url.length - 1);
          }
        }

        if (settings && settings.registries && settings.registries.length) {
          for (const registry of settings.registries) {
            registry.url = this.ensureEndingSlash(registry.url);
          }
        }
        return settings;
      }));
  }

  public areDaemonSettingsValid() {
    return this.getSettings()
      .pipe(map(settings => settings.dockerDaemonSettings))
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
          settings.registries.filter(x => image.includes(x.url.replace('http://', '').replace('https://', '')))[0]
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

  private ensureEndingSlash(str: string) {
    if (!str.endsWith('/')) {
      return str + '/';
    } else {
      return str;
    }
  }
}
