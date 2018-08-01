import { Injectable, NgZone } from '@angular/core';
import { DockerService } from './docker.service';
import { SettingsService } from '../settings/settings.service';
import { switchMap, map, take } from 'rxjs/operators';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';
import { DockerStreamResponse } from './docker-client.model';

@Injectable()
export class DockerImageService {

  constructor(private daemon: DockerService,
    private ngZone: NgZone,
    private settingsService: SettingsService) { }

  public imageList(options?: { all?: boolean, filters?: string, digests?: boolean, options?: any }) {
    return this.daemon.docker(d => d.listImages(options));
  }

  public pullImage(image: string) {
    return this.settingsService.getRegistryAuthForImage(image)
      .pipe(
        take(1),
        switchMap(auth => this.daemon.docker(d => d.pull(image, { 'authconfig': { key: auth } }))
        ),
        map(msg => <IncomingMessage>msg),
        switchMap(msg => this.daemon.modem().pipe(map(m => ({ message: msg, modem: m })))),
        switchMap(response => new Observable<DockerStreamResponse>(observer => {
          const onFinished = () => {
            this.ngZone.run(() => {
              observer.complete();
            });
          };

          const onProgress = (event: DockerStreamResponse) => {
            this.ngZone.run(() => {
              observer.next(event);
            });
          };
          response.modem.followProgress(response.message, onFinished, onProgress);
        }))
      );
  }

  public inspectImage(image: string) {
    return this.daemon.docker(d => d.getImage(encodeURI(image)).inspect());
  }
}
