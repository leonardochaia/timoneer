import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { switchMap, map } from 'rxjs/operators';
import * as dockerHubApi from 'docker-hub-api';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DockerHubService {

  constructor(private settings: SettingsService) {
    dockerHubApi.setCacheOptions({ enabled: true, time: 60 * 5 });
  }

  public getReposForUser() {
    return this.settings.getDockerIOSettings()
      .pipe(
        switchMap(settings => this.logIn(settings.username, settings.password).pipe(map(info => ({ info, settings })))),
        switchMap(settings => from(dockerHubApi.repositories(settings.settings.username) as Promise<{ namespace: string, name: string }[]>))
      );
  }

  protected logIn(username: string, password: string) {
    return from(dockerHubApi.login(username, password))
      .pipe(map((info: any) => {
        console.log(info);
        dockerHubApi.setLoginToken(info.token);
        return info;
      }));
  }
}
