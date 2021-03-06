import { Injectable } from '@angular/core';
import { DockerService } from './docker.service';
import { map, take, switchMap } from 'rxjs/operators';
import { Container, ExecConfig, Exec, ContainerCreateBody } from 'dockerode';
import { from, of } from 'rxjs';
import { TLSSocket } from 'tls';
import { PassThrough } from 'stream';

@Injectable()
export class DockerContainerService {

  constructor(private daemon: DockerService) { }

  public inspect(id: string) {
    return this.getContainer(id, c => c.inspect());
  }

  public list(options?: { all?: boolean, limit?: number, size?: boolean, filters?: any }) {
    return this.daemon.docker(d => d.listContainers(options));
  }

  public stop(id: string) {
    return this.getContainer(id, c => c.stop())
      .pipe(take(1));
  }

  public start(id: string) {
    return this.getContainer(id, c => c.start())
      .pipe(take(1));
  }

  public remove(id: string, options?: { v?: boolean, force?: boolean, link?: boolean }) {
    return this.getContainer(id, c => c.remove(options))
      .pipe(take(1));
  }

  public resize(id: string, options?: { h?: number, w?: number }) {
    return this.getContainer(id, c => c.resize(options))
      .pipe(take(1));
  }

  public logs(id: string) {
    return this.daemon.docker(d => d.getContainer(id).logs({
      follow: true,
      stdout: true,
      stderr: true,
    }))
      .pipe(
        take(1),
        switchMap(stream => this.demuxIfNecesary(id, stream))
      );
  }

  public attach(id: string, options?: {
    detachKeys?: string, logs?: boolean,
    stream?: boolean, stdin?: boolean,
    stdout?: boolean, stderr?: boolean,
    hijack?: boolean
  }) {
    return this.daemon.docker(d => d.getContainer(id).attach(options))
      .pipe(
        take(1),
        switchMap(stream => this.demuxIfNecesary(id, stream))
      );
  }

  public create(options: ContainerCreateBody) {
    return this.daemon.docker(d => d.createContainer(options as any))
      .pipe(take(1));
  }

  public exec(containerId: string, options: ExecConfig) {
    return this.daemon.docker(d => d.getContainer(containerId).exec(options))
      .pipe(
        switchMap((exec: Exec) =>
          from(exec.start({ hijack: true }))
            .pipe(map(socket => ({ socket: socket.output as TLSSocket, exec: exec })))
        ),
        take(1)
      );
  }

  protected demuxIfNecesary(id: string, stream: NodeJS.ReadableStream) {
    const pass = new PassThrough();
    return this.getContainer(id, c => c.inspect())
      .pipe(switchMap((container) => {
        if (container.Config.Tty) {
          return of(stream);
        } else {
          return this.daemon.modem()
            .pipe(map(modem => {
              modem.demuxStream(stream, pass, pass);
              return pass;
            }));
        }
      }));
  }

  protected getContainer<T>(id: string, fn: (c: Container) => Promise<T>) {
    return this.daemon.docker(d => fn(d.getContainer(id)));
  }
}
