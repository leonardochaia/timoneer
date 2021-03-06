import { Injectable, NgZone } from '@angular/core';
import { DockerService } from './docker.service';
import { switchMap, map, take, materialize, dematerialize } from 'rxjs/operators';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';
import { DockerStreamResponse } from './docker-client.model';
import { ImageSearchResult } from 'dockerode';
import { ImageSource } from '../docker-images/image-source.model';

@Injectable()
export class DockerImageService {

  constructor(
    private readonly daemon: DockerService,
    private readonly ngZone: NgZone) { }

  public imageList(options?: { all?: boolean, filters?: string, digests?: boolean, options?: any }) {
    return this.daemon.docker(d => d.listImages(options));
  }

  public searchDockerHub(term: string) {
    return this.daemon.docker(d => d.searchImages({
      term: term
    }) as Promise<ImageSearchResult[]>);
  }

  public pullImage(image: string, source: ImageSource) {
    if (!image.includes(':')) {
      image += ':latest';
    }
    const auth = source.hasAuthentication ? source.getBasicAuth() : null;
    return this.daemon.docker(d => d.pull(image, { 'authconfig': { key: auth } }))
      .pipe(
        take(1),
        map(msg => <IncomingMessage>msg),
        switchMap(msg => this.daemon.modem().pipe(map(m => ({ message: msg, modem: m })))),
        switchMap(response => new Observable<DockerStreamResponse>(observer => {
          const onFinished = (error) => {
            this.ngZone.run(() => {
              if (error) {
                observer.error(error);
              } else {
                observer.complete();
              }

              observer.unsubscribe();
            });
          };

          const onProgress = (event: DockerStreamResponse) => {
            this.ngZone.run(() => {
              observer.next(event);
            });
          };
          response.modem.followProgress(response.message, onFinished, onProgress);
          return () => {
            response.message.destroy();
          };
        }).pipe(materialize())),
        dematerialize()
        // materialize/dematerialize to send the complete event through.
        // https://stackoverflow.com/questions/40611203/switchmap-does-not-seem-to-complete-when-the-inner-observable-completes
      );
  }

  public isUserFriendlyResponse(response: DockerStreamResponse) {
    return response
      && response.status
      && !response.status.startsWith('Digest:');
  }

  public inspectImage(image: string) {
    return this.daemon.docker(d => d.getImage(encodeURI(image)).inspect());
  }

  public removeImage(image: string) {
    return this.daemon.docker(d => d.getImage(encodeURI(image)).remove());
  }

  public getHistory(image: string) {
    return this.daemon.docker(d => d.getImage(encodeURI(image)).history());
  }
}
