import { Injectable } from '@angular/core';
import { DaemonService } from './daemon.service';
import { SystemInfo, SystemDfResponse } from 'dockerode';

@Injectable()
export class DockerSystemService {

  constructor(private daemon: DaemonService) { }

  public info() {
    return this.daemon.docker(d => d.info() as Promise<SystemInfo>);
  }

  public df() {
    return this.daemon.docker(d => d.df() as Promise<SystemDfResponse>);
  }
}
