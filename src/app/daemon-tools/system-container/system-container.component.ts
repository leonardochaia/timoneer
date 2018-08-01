import { Component, OnInit } from '@angular/core';
import { SystemDfResponse } from 'dockerode';
import { DockerSystemService } from '../docker-system.service';

@Component({
  selector: 'tim-system-container',
  templateUrl: './system-container.component.html',
  styleUrls: ['./system-container.component.scss']
})
export class SystemContainerComponent implements OnInit {

  public dataUsage: SystemDfResponse;

  public imageSize: number;
  public containerSize: number;
  public volumeSize: number;
  public systemInfo: any;

  constructor(private systemService: DockerSystemService) { }

  public ngOnInit() {
    this.systemService.info()
      .subscribe(info => {
        this.systemInfo = info;
      });
    this.systemService.df()
      .subscribe((dataUsage) => {
        this.dataUsage = dataUsage;

        this.imageSize = dataUsage.Images.map(i => i.Size).reduce((p, c) => p + c, 0);
        this.imageSize -= dataUsage.Images.map(i => i.SharedSize).reduce((p, c) => p + c, 0);
        this.containerSize = dataUsage.Containers.map(i => i.SizeRootFs).reduce((p, c) => p + c, 0);
        this.volumeSize = dataUsage.Volumes.map(i => i.UsageData.Size).reduce((p, c) => p + c, 0);
      });
  }

}
