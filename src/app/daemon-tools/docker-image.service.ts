import { Injectable } from '@angular/core';
import { DaemonService } from './daemon.service';

@Injectable()
export class DockerImageService {

  constructor(private daemon: DaemonService) { }

  public imageList(options?: { all?: boolean, filters?: string, digests?: boolean, options?: any }) {
    return this.daemon.docker(d => d.listImages(options));
  }
}
