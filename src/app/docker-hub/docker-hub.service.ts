import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DockerHubRepositoryResponse } from './docker-hub.model';

@Injectable({
  providedIn: 'root'
})
export class DockerHubService {

  constructor(private settings: SettingsService,
    private httpClient: HttpClient) {
  }

  public getReposForUser(username: string = null, pageSize = 15, pageNumber = 1) {

    return this.settings.getDockerIOSettings()
      .pipe(
        switchMap(settings => this.logIn(settings.username, settings.password).pipe(map(info => ({ info, settings })))),
        switchMap(settings => this.getRepos(username || settings.settings.username, settings.info.token, pageSize, pageNumber))
      );
  }

  protected getRepos(username: string, token: string, pageSize: number, pageNumber: number) {
    return this.httpClient.get<DockerHubRepositoryResponse>(`https://hub.docker.com/v2/repositories/${username}/`,
      {
        params: {
          'page_size': '' + pageSize,
          'page': '' + pageNumber,
        },
        headers: {
          Authorization: `JWT ${token}`
        }
      });
  }

  protected logIn(username: string, password: string) {
    return this.httpClient.post<{ token: string }>(`https://hub.docker.com/v2/users/login`, {
      username: username,
      password: password
    });
  }
}
