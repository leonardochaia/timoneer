import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DockerHubRepositoryResponse, RepositoryInfo, DockerHubRepositoryTagResponse } from './docker-hub.model';
import { DockerRegistrySettings } from '../settings/settings.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DockerHubService {

  constructor(private settings: SettingsService,
    private httpClient: HttpClient) {
  }

  public getRepository(repo: string) {
    repo = this.appendLibraryIfNecessary(repo);
    return this.get<RepositoryInfo>(`https://hub.docker.com/v2/repositories/${repo}`);
  }

  public getRepositoryTags(repo: string) {
    repo = this.appendLibraryIfNecessary(repo);
    return this.get<DockerHubRepositoryTagResponse>(`https://hub.docker.com/v2/repositories/${repo}/tags`);
  }

  public getReposForUser(username: string = null, pageSize = 15, pageNumber = 1) {
    return this.get<DockerHubRepositoryResponse>(`https://hub.docker.com/v2/repositories/${username}/`, {
      'page_size': '' + pageSize,
      'page': '' + pageNumber,
    });
  }

  protected appendLibraryIfNecessary(repo: string) {
    if (!repo.includes('/')) {
      repo = 'library/' + repo;
    }

    if (repo.includes(':')) {
      repo = repo.slice(0, repo.indexOf(':'));
    }

    return repo;
  }

  protected get<T>(url: string, params?: any) {
    const loginIfNeeded = (settings: DockerRegistrySettings) => {
      if (settings.username && settings.password) {
        return this.logIn(settings.username, settings.password);
      } else {
        return of(null);
      }
    };

    return this.settings.getDockerIOSettings()
      .pipe(
        switchMap(settings => loginIfNeeded(settings).pipe(map(info => ({ info, settings })))),
        switchMap(r => this.httpClient.get<T>(url, {
          headers: r.info ? { Authorization: `JWT ${r.info.token}` } : null,
          params: params
        }))
      );
  }

  protected logIn(username: string, password: string) {
    return this.httpClient.post<{ token: string }>(`https://hub.docker.com/v2/users/login`, {
      username: username,
      password: password
    });
  }
}
