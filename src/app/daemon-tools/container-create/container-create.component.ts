import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { switchMap, takeWhile } from 'rxjs/operators';
import { NotificationService } from '../../shared/notification.service';
import { ContainerCreateOptions, ImageInspectInfo, Container } from 'dockerode';
import { from } from 'rxjs';
import { DockerContainerService } from '../docker-container.service';
import { ContainerCreationSuggestedPort, PortBinding } from '../docker-client.model';

interface VolumeBinding {
  containerPath?: string;
  hostPath?: string;
  description?: string;
  readonly?: boolean;
}

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
  public suggestedVolumes: { containerPath: string, description?: string }[];

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

  public get filteredVolumes() {
    if (this.suggestedVolumes) {
      return this.suggestedVolumes.filter(p => !this.volumeBindingsArray.controls.some(c => c.value.containerPath === p.containerPath));
    } else {
      return [];
    }
  }

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

  public addVolumeBinding(binding: VolumeBinding = null) {
    binding = binding || {};
    const arr = this.form.get('volumeBindings') as FormArray;
    const group = this.fb.group({
      'containerPath': [binding.containerPath, Validators.required],
      'hostPath': [binding.hostPath, Validators.required],
      'description': [binding.description],
      'readonly': [binding.readonly || false, Validators.required]
    });
    arr.push(group);

    // Update hostPath with containerPath value
    // while hostPath is dirty
    group.get('containerPath')
      .valueChanges
      .pipe(takeWhile(() => group.get('hostPath').pristine))
      .subscribe(containerPath => {
        group.get('hostPath').setValue(containerPath);
      });
  }

  public removeVolumeBinding(control: AbstractControl) {
    this.volumeBindingsArray.removeAt(this.volumeBindingsArray.controls.indexOf(control));
  }

  public canAddVolumeBinding() {
    return !this.volumeBindingsArray.length || !this.volumeBindingsArray.controls.some(c => c.invalid);
  }

  public imageSelected(image: ImageInspectInfo) {
    this.imageData = image;
  }

  public launch() {
    const data: ContainerCreateOptions = {
      Image: this.form.getRawValue().image,
      Tty: this.form.value.launchConfig.tty,
      HostConfig: {
        PortBindings: {},
        Binds: [],
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
      data.HostConfig.Binds.push(`${volumeMapping.hostPath}:${volumeMapping.containerPath}:${volumeMapping.readonly ? 'ro' : 'rw'}`);
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
