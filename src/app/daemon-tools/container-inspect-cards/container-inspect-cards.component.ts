import { Component, OnInit, Input } from '@angular/core';
import { DockerContainerService } from '../docker-container.service';
import { ContainerInspectInfo } from 'dockerode';

@Component({
  selector: 'tim-container-inspect-cards',
  templateUrl: './container-inspect-cards.component.html',
  styleUrls: ['./container-inspect-cards.component.scss']
})
export class ContainerInspectCardsComponent implements OnInit {

  @Input()
  public containerId: string;

  public containerInfo: ContainerInspectInfo;
  public portMappings: { containerPort: string, hostPort: string }[] = [];
  public labels: { key: string, value: string }[] = [];

  constructor(private containerService: DockerContainerService) { }

  public ngOnInit() {

    this.containerService.inspect(this.containerId)
      .subscribe(info => {
        this.containerInfo = info;
        for (const containerPort in info.HostConfig.PortBindings) {
          if (info.HostConfig.PortBindings.hasOwnProperty(containerPort)) {
            const portBindings = info.HostConfig.PortBindings[containerPort];
            for (const iterator of portBindings) {
              const port = {
                containerPort: containerPort.slice(0, containerPort.indexOf('/')),
                hostPort: iterator.HostPort
              };
              this.portMappings.push(port);
            }

            for (const key in info.Config.Labels) {
              if (info.Config.Labels.hasOwnProperty(key)) {
                const label = info.Config.Labels[key];
                this.labels.push({
                  key: key,
                  value: label
                });
              }
            }
          }
        }
      });
  }

}
