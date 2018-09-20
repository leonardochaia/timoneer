import { Component, OnInit } from '@angular/core';
import { SystemInfo } from 'dockerode';
import { DockerSystemService, DockerDiskUsageResume } from '../docker-system.service';
import { map, take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'tim-system-container',
  templateUrl: './system-container.component.html',
  styleUrls: ['./system-container.component.scss']
})
export class SystemContainerComponent implements OnInit {

  public dataUsage: DockerDiskUsageResume;
  public systemInfo: SystemInfo;

  public loading: boolean;

  constructor(private systemService: DockerSystemService) { }

  public ngOnInit() {
    this.loading = true;
    forkJoin([
      this.systemService.info()
        .pipe(
          map(info => this.systemInfo = info),
          take(1)
        ),
      this.systemService.diskUsageResume()
        .pipe(
          map(dataUsage => this.dataUsage = dataUsage),
          take(1)
        )
    ])
      .subscribe(() => {
        this.loading = false;
      });
  }
}
