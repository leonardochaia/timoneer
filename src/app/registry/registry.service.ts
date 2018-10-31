import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { DockerRegistrySettings } from '../settings/settings.model';
import { RegistryAuthService } from './registry-auth.service';
import { ImageManifest } from './registry.model';

@Injectable({
  providedIn: 'root'
})
export class RegistryService {

  constructor(private httpClient: HttpClient,
    private authService: RegistryAuthService) { }

  public getRepositories(registrySettings: DockerRegistrySettings, results?: number) {
    const params = results ? { n: results.toString() } : null;
    return this.get<{ repositories: string[] }>(registrySettings, `v2/_catalog`, params)
      .pipe(map(r => r.repositories));
  }

  public getRepoTags(registrySettings: DockerRegistrySettings, image: string) {
    return this.get<{ tags: string[] }>(registrySettings, `v2/${image}/tags/list`)
      .pipe(map(r => r.tags));
  }

  public getImageManifest(registrySettings: DockerRegistrySettings, name: string, reference: string) {
    return this.get<ImageManifest>(registrySettings, `v2/${name}/manifests/${reference}`);
  }

  public testRegistrySettings(settings: DockerRegistrySettings) {
    return this.get<void>(settings, `v2/`);
  }

  protected get<T>(registrySettings: DockerRegistrySettings,
    path: string,
    params?: { [param: string]: string | string[]; }): Observable<T> {

    const doHttpCall = (headers?: any) => this.httpClient.get<T>(this.ensureEndingSlash(registrySettings.url) + path, {
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

          return this.authService.getAccesstokenFromHeader(header, registrySettings.url,
            registrySettings.username, registrySettings.password)
            .pipe(
              switchMap(token => doHttpCall({
                Authorization: `Bearer ${token}`
              }))
            );

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
