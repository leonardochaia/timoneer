import { Injectable } from '@angular/core';
import { DockerService } from './docker.service';
import { SystemInfo, SystemDfResponse } from 'dockerode';

@Injectable()
export class DockerSystemService {

  constructor(private daemon: DockerService) { }

  public info() {
    return this.daemon.docker(d => d.info() as Promise<SystemInfo>);
  }

  public df() {
    return this.daemon.docker(d => d.df() as Promise<SystemDfResponse>);
  }
}
