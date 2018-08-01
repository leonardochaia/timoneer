import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from '../../shared/notification.service';
import { ImageInspectInfo, Container, ContainerCreateBody } from 'dockerode';
import { from } from 'rxjs';
import { DockerContainerService } from '../docker-container.service';
import {
  ContainerCreationSuggestedPort, PortBinding,
  ContainerCreationSuggestedVolume, VolumeBinding, VolumeBindingType
} from '../docker-client.model';

@Component({
  selector: 'tim-container-create',
  templateUrl: './container-create.component.html',
  styleUrls: ['./container-create.component.scss']
})
export class ContainerCreateComponent implements OnInit {

  @Input()
  public initialImage: string;

  @Input()
  public disableImage = false;

  @Input()
  public suggestedPorts: ContainerCreationSuggestedPort[];

  @Input()
  public suggestedVolumes: ContainerCreationSuggestedVolume[];

  @Output()
  public created = new EventEmitter<string>();

  public form = this.fb.group({
    'image': ['', Validators.required],
    'launchConfig': this.fb.group({
      'containerName': [''],
      'command': [''],
      'tty': [true, Validators.required],
    }),
    'portBindings': this.fb.array([]),
    'volumeBindings': this.fb.array([]),
  });

  public get portBindingsArray() {
    return this.form.get('portBindings') as FormArray;
  }

  public get volumeBindingsArray() {
    return this.form.get('volumeBindings') as FormArray;
  }

  public imageData: ImageInspectInfo;

  constructor(private containerService: DockerContainerService,
    private notification: NotificationService,
    private fb: FormBuilder) {
  }

  public ngOnInit() {
    if (this.initialImage) {
      const imgCtrl = this.form.get('image');
      imgCtrl.setValue(this.initialImage);
      if (this.disableImage) {
        imgCtrl.disable();
      }
    }
  }

  public imageSelected(image: ImageInspectInfo) {
    this.imageData = image;
  }

  public launch() {
    const data: ContainerCreateBody = {
      Image: this.form.getRawValue().image,
      Tty: this.form.value.launchConfig.tty,
      HostConfig: {
        PortBindings: {},
        Binds: [],
        Mounts: []
      },
      // Required so that attach works.
      OpenStdin: true,
    };

    for (const portMapping of this.portBindingsArray.controls.map(c => c.value as PortBinding)) {
      data.HostConfig.PortBindings[`${portMapping.containerPort}/tcp`] = [{
        HostPort: portMapping.assignRandomPort ? null : portMapping.hostPort.toString()
      }] as any;
    }

    for (const volumeMapping of this.volumeBindingsArray.controls.map(c => c.value as VolumeBinding)) {
      data.HostConfig.Mounts.push({
        Target: volumeMapping.containerPath,
        Source: volumeMapping.type === VolumeBindingType.Volume ? volumeMapping.volumeName : volumeMapping.hostPath,
        Type: volumeMapping.type.toString(),
        ReadOnly: volumeMapping.readonly
      });
    }

    const launchConfig = this.form.get('launchConfig').value;
    if (this.form.value.launchConfig.command && this.form.value.launchConfig.command.length) {
      data.Cmd = JSON.parse(launchConfig.command);
    }

    data.name = launchConfig.containerName;

    this.containerService.create(data)
      .pipe(switchMap(container => {
        this.notification.open(`Container Created. Starting.. ${container.id}`);
        return from(container.start() as Promise<Container>);
      }))
      .subscribe(container => {
        this.created.emit(container.id);
      });
  }
}
