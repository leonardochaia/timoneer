import { Injectable } from '@angular/core';
import { DockerService } from './docker.service';
import { SystemInfo, SystemDfResponse } from 'dockerode';
import { map } from 'rxjs/operators';

@Injectable()
export class DockerSystemService {

  constructor(private daemon: DockerService) { }

  public info() {
    return this.daemon.docker(d => d.info() as Promise<SystemInfo>);
  }

  public df() {
    return this.daemon.docker(d => d.df() as Promise<SystemDfResponse>);
  }

  public diskUsageResume() {
    return this.df()
      .pipe(map(dataUsage => new DockerDiskUsageResume(dataUsage)));
  }
}

export interface DockerDiskUsageListResume {
  size: number;
  count: number;
}

// https://github.com/docker/cli/blob/a900ba8aeff764a5fb5bb7e18eee25d75a220732/cli/command/formatter/disk_usage.go
export class DockerDiskUsageResume {

  public readonly images: DockerDiskUsageListResume;
  public readonly containers: DockerDiskUsageListResume;
  public readonly volumes: DockerDiskUsageListResume;

  constructor(dataUsage: SystemDfResponse) {
    this.images = {
      size: dataUsage.LayersSize,
      count: dataUsage.Images.length
    };

    this.containers = {
      size: dataUsage.Containers.map(i => i.SizeRw || 0).reduce((p, c) => p + c, 0),
      count: dataUsage.Containers.length,
    };

    this.volumes = {
      size: dataUsage.Volumes.map(i => i.UsageData.Size >= 0 ? i.UsageData.Size : 0).reduce((p, c) => p + c, 0),
      count: dataUsage.Volumes.length,
    };
  }
}
