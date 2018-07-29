import { Injectable, NgZone } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { map, switchMap } from 'rxjs/operators';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { DockerStreamResponse } from './docker-client.model';
import { ElectronService } from '../electron-tools/electron.service';
import { IncomingMessage } from 'http';
import * as Dockerode from 'dockerode';
import { Exec } from 'dockerode';
import { TLSSocket } from 'tls';

@Injectable({
  providedIn: 'root'
})
export class DaemonService {

  protected get daemonUrl() {
    return this.settingsService.getSettings()
      .pipe(map(settings => settings.dockerClientSettings.url));
  }

  protected dockerSubject = new BehaviorSubject<Dockerode>(null);

  constructor(private settingsService: SettingsService,
    private zone: NgZone,
    electronService: ElectronService) {

    settingsService.getSettings()
      .pipe(map(settings => settings.dockerClientSettings))
      .subscribe(settings => {
        if (settings.fromEnvironment) {
          this.dockerSubject.next(new Dockerode());
        } else {
          const fs = electronService.fs;
          this.dockerSubject.next(new Dockerode({
            host: settings.url,
            cert: fs.readFileSync(`${settings.certPath}/cert.pem`),
            ca: fs.readFileSync(`${settings.certPath}/ca.pem`),
            key: fs.readFileSync(`${settings.certPath}/key.pem`)
          }));
        }
      });
  }

  public docker<T>(fn: (api: Dockerode) => Promise<T>) {
    if (this.dockerSubject.value) {
      return from(fn(this.dockerSubject.value));
    } else {
      return this.dockerSubject.asObservable()
        .pipe(
          switchMap(docker => from(fn(docker)))
        );
    }
  }

  public streamToObservable<T>(stream: NodeJS.EventEmitter) {
    return new Observable<T>(observer => {
      stream.on('data', (data) => {
        this.zone.run(() => {
          observer.next(data);
        });
      });

      stream.on('error', (data) => {
        this.zone.run(() => {
          observer.error(data);
        });
      });

      stream.on('end', () => {
        this.zone.run(() => {
          observer.complete();
        });
      });
    });
  }

  public exec(containerId: string) {
    return this.docker(d => d.getContainer(containerId).exec({
      Cmd: ['bin/sh'],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
    }))
      .pipe(
        switchMap((exec: Exec) => from(exec.start({
          hijack: true,
        }))),
        map(socket => socket.output as TLSSocket)
      );
  }

  public pullImage(image: string) {
    return this.settingsService.getRegistryAuthForImage(image)
      .pipe(
        switchMap(auth =>
          this.docker(d => d.pull(image, { 'authconfig': { key: auth } }))
        ),
        map(r => <IncomingMessage>r),
        switchMap(r => this.docker(d => Promise.resolve(d.modem)).pipe(map(m => ({ message: r, modem: m })))),
        switchMap(msg => new Observable<DockerStreamResponse>(observer => {
          const modem = msg.modem as any;

          const onFinished = () => {
            this.zone.run(() => {
              observer.complete();
            });
            // output is an array with output json parsed objects
          };

          const onProgress = (event: DockerStreamResponse) => {
            this.zone.run(() => {
              observer.next(event);
            });
          };
          modem.followProgress(msg.message, onFinished, onProgress);
        }))
      );
  }

}
