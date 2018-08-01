import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { map, switchMap, takeUntil, take } from 'rxjs/operators';
import { from, BehaviorSubject, Subject } from 'rxjs';
import { ElectronService } from '../electron-tools/electron.service';
import * as Dockerode from 'dockerode';
import { DockerClientSettings } from '../settings/settings.model';

import * as path from 'path';
import * as splitca from 'split-ca';
import { Modem } from 'docker-modem';

@Injectable()
export class DockerService implements OnDestroy {

  protected get daemonUrl() {
    return this.settingsService.getSettings()
      .pipe(map(settings => settings.dockerClientSettings.url));
  }

  protected dockerSubject = new BehaviorSubject<Dockerode>(null);

  private disposed = new Subject();

  constructor(private settingsService: SettingsService,
    private electronService: ElectronService) {

    settingsService.getSettings()
      .pipe(
        map(settings => settings.dockerClientSettings),
        takeUntil(this.disposed)
      )
      .subscribe(settings => {
        if (settings.fromEnvironment) {
          this.dockerSubject.next(new Dockerode());
        } else {
          const opts = this.getDockerodeConfigFromSettings(settings);
          this.dockerSubject.next(new Dockerode(opts));
        }
      });
  }

  public modem() {
    return this.docker(d => Promise.resolve(d.modem as Modem))
      .pipe(take(1));
  }

  public docker<T>(fn: (api: Dockerode) => Promise<T>) {
    return this.dockerSubject
      .pipe(
        switchMap(docker => from(fn(docker)))
      );
  }

  public ngOnDestroy() {
    this.disposed.next();
    this.disposed.unsubscribe();
  }

  private getDockerodeConfigFromSettings(settings: DockerClientSettings) {
    const opts: Dockerode.DockerOptions = {};
    if (settings.url) {
      // inspierd on docker-modem: https://github.com/apocas/docker-modem/blob/master/lib/modem.js
      if (settings.url.indexOf('unix://') === 0) {
        opts.socketPath = settings.url.substring(7);
      } else {
        const split = /(?:tcp:\/\/)?(.*?):([0-9]+)/g.exec(settings.url);

        if (!split || split.length !== 3) {
          throw new Error('Url env variable should be something like tcp://localhost:2376');
        }

        opts.port = split[2];

        if (settings.tlsVerify || opts.port === '2376') {
          opts.protocol = 'https';
        } else {
          opts.protocol = 'http';
        }

        opts.host = split[1];

        if (settings.certPath && settings.certPath.length) {
          const fs = this.electronService.fs;
          opts.ca = splitca(path.join(settings.certPath, 'ca.pem'));
          opts.cert = fs.readFileSync(path.join(settings.certPath, 'cert.pem'));
          opts.key = fs.readFileSync(path.join(settings.certPath, 'key.pem'));
        }
      }
    }
    return opts;
  }

}
