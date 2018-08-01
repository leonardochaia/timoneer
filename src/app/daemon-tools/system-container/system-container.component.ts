import { Component, OnInit } from '@angular/core';
import { DaemonService } from '../daemon.service';
import { SystemDfResponse } from 'dockerode';

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

  constructor(private daemonService: DaemonService) { }

  public ngOnInit() {
    this.daemonService.docker(d => d.info())
      .subscribe(info => {
        this.systemInfo = info;
      });
    this.daemonService.docker(d => d.df())
      .subscribe((info: SystemDfResponse) => {
        this.dataUsage = info;
        this.imageSize = info.Images.map(i => i.Size).reduce((p, c) => p + c, 0);
        this.imageSize -= info.Images.map(i => i.SharedSize).reduce((p, c) => p + c, 0);
        this.containerSize = info.Containers.map(i => i.SizeRootFs).reduce((p, c) => p + c, 0);
        this.volumeSize = info.Volumes.map(i => i.UsageData.Size).reduce((p, c) => p + c, 0);
      });
  }

}
