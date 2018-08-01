import { Component, OnInit } from '@angular/core';
import { SystemDfResponse, SystemInfo } from 'dockerode';
import { DockerSystemService } from '../docker-system.service';
import { map, take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'tim-system-container',
  templateUrl: './system-container.component.html',
  styleUrls: ['./system-container.component.scss']
})
export class SystemContainerComponent implements OnInit {

  public dataUsage: SystemDfResponse;
  public systemInfo: SystemInfo;

  public loading: boolean;

  public imageSize: number;
  public containerSize: number;
  public volumeSize: number;

  constructor(private systemService: DockerSystemService) { }

  public ngOnInit() {
    this.loading = true;
    forkJoin([
      this.systemService.info()
        .pipe(
          map(info => this.systemInfo = info),
          take(1)
        ),
      this.systemService.df()
        .pipe(
          map(dataUsage => {
            this.dataUsage = dataUsage;

            this.imageSize = dataUsage.Images.map(i => i.Size).reduce((p, c) => p + c, 0);
            this.imageSize -= dataUsage.Images.map(i => i.SharedSize).reduce((p, c) => p + c, 0);
            this.containerSize = dataUsage.Containers.map(i => i.SizeRootFs).reduce((p, c) => p + c, 0);
            this.volumeSize = dataUsage.Volumes.map(i => i.UsageData.Size).reduce((p, c) => p + c, 0);
            return this.dataUsage;
          }),
          take(1)
        )
    ])
      .subscribe(() => {
        this.loading = false;
      });
  }
}
