import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, switchMap, map, take } from 'rxjs/operators';
import { throwError, Observable, forkJoin, of } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { DockerRegistrySettings } from '../settings/settings.model';
import { RegistryAuthService } from './registry-auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegistryService {

  constructor(private httpClient: HttpClient,
    private authService: RegistryAuthService,
    private settingsService: SettingsService) { }

  public getRepositories(registryUrl: string, results?: number) {
    const params = results ? { n: results.toString() } : null;
    return this.get<{ repositories: string[] }>(registryUrl, `v2/_catalog`, params)
      .pipe(map(r => r.repositories));
  }

  public getRepoTags(registryUrl: string, image: string) {
    return this.get<{ tags: string[] }>(registryUrl, `v2/${image}/tags/list`)
      .pipe(map(r => r.tags));
  }

  public getImageManifest(registryUrl: string, name: string, reference: string) {
    return this.get(registryUrl, `v2/${name}/manifests/${reference}`);
  }

  public getRepositoriesFromAllRegistries() {
    const getRepos = (settings: DockerRegistrySettings) => {
      return this.getRepositories(settings.url)
        .pipe(
          take(1),
          map(repos => ({ name: this.settingsService.getRegistryName(settings), repos }))
        );
    };
    return this.settingsService.getSettings()
      .pipe(
        take(1),
        map(settings => settings.registries.filter(r => r.allowsCatalog)),
        switchMap(registries => registries.length ? forkJoin(registries.map(r => getRepos(r))) : of([]))
      );
  }

  public testRegistrySettings(settings: DockerRegistrySettings) {
    return this.get<void>(settings.url, `v2/_catalog`, { n: '1' }, settings);
  }

  protected get<T>(registryUrl: string, path: string, params?: { [param: string]: string | string[]; },
    settings?: DockerRegistrySettings): Observable<T> {

    const doHttpCall = (headers?: any) => this.httpClient.get<T>(this.ensureEndingSlash(registryUrl) + path, {
      headers: headers,
      params: params
    });

    return doHttpCall()
      .pipe(catchError(e => {
        if (e.status === 401) {
          const header = e.headers.get('www-authenticate');

          if (!header) {
            console.warn(`WWW-Authenticate Header was not present (or not CORS exposed). Access token won't be requested`);
            return throwError(e);
          }

          return (settings ? of(settings) : this.settingsService.getRegistrySettingsForUrl(registryUrl))
            .pipe(
              take(1),
              switchMap(registrySettings => {
                if (!registrySettings) {
                  return throwError(`Unauthorized, no registry settings found for registry [${registryUrl}]`);
                }
                return this.authService.getAccesstokenFromHeader(header, registrySettings.url,
                  registrySettings.username, registrySettings.password)
                  .pipe(
                    switchMap(token => doHttpCall({
                      Authorization: `Bearer ${token}`
                    }))
                  );
              }
              ));

        } else {
          return throwError(e);
        }
      }));
  }

  private ensureEndingSlash(str: string) {
    if (!str.endsWith('/')) {
      return str + '/';
    } else {
      return str;
    }
  }
}
