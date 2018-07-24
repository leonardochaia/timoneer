import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { map, switchMap, share } from 'rxjs/operators';

import { ContainerApi, ImageApi, ExecApi } from 'docker-client';
import { from, Observable } from 'rxjs';

import { DockerStreamResponse } from './docker-client.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DaemonService {

  public ContainerApi = this.daemonUrl.pipe(
    map(url => new ContainerApi({ basePath: url })),
  );

  public ImageApi = this.daemonUrl.pipe(
    map(url => new ImageApi({ basePath: url })),
  );

  public ExecApi = this.daemonUrl.pipe(
    map(url => new ExecApi({ basePath: url })),
  );

  protected get daemonUrl() {
    return this.settingsService.getSettings()
      .pipe(map(settings => settings.dockerDaemonSettings.url));
  }

  constructor(private settingsService: SettingsService) { }

  public imageApi<T>(fn: (api: ImageApi) => Promise<T>) {
    return this.ImageApi.pipe(
      switchMap(api => this.responsePromiseToObservable(fn(api)))
    );
  }

  public containerApi<T>(fn: (api: ContainerApi) => Promise<T>) {
    return this.ContainerApi.pipe(
      switchMap(api => this.responsePromiseToObservable(fn(api)))
    );
  }

  public execApi<T>(fn: (api: ExecApi) => Promise<T>) {
    return this.ExecApi.pipe(
      switchMap(api => this.responsePromiseToObservable(fn(api)))
    );
  }

  public responseStreamToObservable(response: Response) {
    return new Observable<DockerStreamResponse>(observer => {
      const reader = response.body.getReader();
      const decoder = new window['TextDecoder']('utf-8');

      let previousJson: string = null;

      const processText = (done: boolean, value: any) => {
        // Result objects contain two properties:
        // done  - true if the stream has already given you all its data.
        // value - some data. Always undefined when done is true.
        if (done) {
          observer.complete();
          return;
        }

        const decoded = decoder
          .decode(value);
        const jsons = decoded
          .split('\n');

        for (const json of jsons) {
          if (json === '' || json === ' ') {
            continue;
          }

          try {
            const dockerResponse = JSON.parse(json) as DockerStreamResponse;
            observer.next(dockerResponse);
            previousJson = null;
          } catch (error) {

            // console.info("FAILED TO DESERIALIZE JSON");

            // console.info('FULL CHUNK:');
            // console.log(decoded);

            // console.info('JSON THAT FAILED:');
            // console.log(json);
            // console.info('JSON ERROR:');
            // console.log(error);

            if (previousJson) {
              previousJson += json;
              console.log('Attempting to merge failed json from previous chunk..');
              console.log(previousJson);
              try {
                const dockerResponse = JSON.parse(previousJson) as DockerStreamResponse;
                observer.next(dockerResponse);
              } catch (error) {
                console.log('Failed to deserialize merged json from previous chunk..');
                console.error(error);
              }
              previousJson = null;
            } else {
              previousJson = json;
            }

          }
        }

        // Read some more, and call this function again
        return reader.read().then((r) => processText(r.done, r.value));
      };

      reader.read().then((r) => processText(r.done, r.value));

      return {
        unsubscribe: () => reader.cancel
      };
    });
  }

  public logResponseStreamToObservable(response: Response) {
    return new Observable<string>(observer => {
      const reader = response.body.getReader();
      const decoder = new window['TextDecoder']('utf-8');

      const processText = (done: boolean, value: any) => {
        // Result objects contain two properties:
        // done  - true if the stream has already given you all its data.
        // value - some data. Always undefined when done is true.
        if (done) {
          observer.complete();
          return;
        }

        const decoded = decoder
          .decode(value);

        console.log(decoded);
        observer.next(decoded);

        // Read some more, and call this function again
        return reader.read().then((r) => processText(r.done, r.value));
      };

      reader.read().then((r) => processText(r.done, r.value));

      return {
        unsubscribe: () => reader.cancel
      };
    });
  }

  private responsePromiseToObservable<T>(promise: Promise<T>) {
    return from(promise.then(v => v, (e: Response | HttpErrorResponse) => {
      if (e instanceof Response) {
        return e && e.json().then(j => Promise.reject({ message: j.message, status: e.status }));
      } else {
        return Promise.reject(e);
      }
    }));
  }
}
