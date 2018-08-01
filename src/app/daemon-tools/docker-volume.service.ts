import { Injectable } from '@angular/core';
import { DockerService } from './docker.service';
import { VolumeInfo } from 'dockerode';
import { map } from 'rxjs/operators';

@Injectable()
export class DockerVolumeService {

  constructor(private daemon: DockerService) { }

  public list(options?: { filter?: string }) {
    return this.daemon.docker(d => d.listVolumes(options) as Promise<any> as Promise<{ Volumes: VolumeInfo[] }>)
      .pipe(map(v => v.Volumes));
  }
}
