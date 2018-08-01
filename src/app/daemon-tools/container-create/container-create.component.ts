import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { DaemonService } from '../daemon.service';
import { switchMap, map, filter, takeWhile } from 'rxjs/operators';
import { NotificationService } from '../../shared/notification.service';
import { ContainerCreateOptions, ImageInspectInfo, Container } from 'dockerode';
import { from } from 'rxjs';

interface PortBinding {
  containerPort?: number;
  hostPort?: number;
  description?: string;
  assignRandomPort?: boolean;
}

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
  public suggestedPorts: { containerPort: number, description?: string }[];

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

  public get filteredPorts() {
    return this.availablePorts.filter(p => !this.portBindingsArray.controls.some(c => c.value.containerPort === p.containerPort));
  }

  public get filteredVolumes() {
    if (this.suggestedVolumes) {
      return this.suggestedVolumes.filter(p => !this.volumeBindingsArray.controls.some(c => c.value.containerPath === p.containerPath));
    } else {
      return [];
    }
  }

  private availablePorts: { containerPort: number, description?: string }[];

  constructor(private daemonService: DaemonService,
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
    this.availablePorts = this.suggestedPorts || [];
  }

  public addPortBinding(binding: PortBinding = null) {
    binding = binding || {};
    const arr = this.form.get('portBindings') as FormArray;
    const group = this.fb.group({
      'containerPort': [binding.containerPort, Validators.required],
      'hostPort': [binding.hostPort, Validators.required],
      'description': [binding.description],
      'assignRandomPort': [binding.assignRandomPort || false, Validators.required]
    });
    arr.push(group);

    // Update hostPort with containerPort value
    // while hostPort is dirty.
    group.get('containerPort').valueChanges
      .pipe(takeWhile(() => group.get('hostPort').pristine))
      .subscribe(containerPort => {
        group.get('hostPort').setValue(containerPort);
      });

    // Update hostPort validators chen assignRandomPort changes.
    group.get('assignRandomPort').valueChanges
      .subscribe(assignRandomPort => {
        if (assignRandomPort) {
          group.get('hostPort').setValidators([]);
        } else {
          group.get('hostPort').setValidators([Validators.required]);
        }
        group.get('hostPort').updateValueAndValidity();
      });
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

    // Update hostPath with containerPort value
    // while hostPath is dirty
    group.get('containerPath')
      .valueChanges
      .pipe(takeWhile(() => group.get('hostPath').pristine))
      .subscribe(containerPort => {
        group.get('hostPath').setValue(containerPort);
      });
  }

  public removeVolumeBinding(control: AbstractControl) {
    this.volumeBindingsArray.removeAt(this.volumeBindingsArray.controls.indexOf(control));
  }

  public removePortBinding(control: AbstractControl) {
    this.portBindingsArray.removeAt(this.portBindingsArray.controls.indexOf(control));
  }

  public imageSelected(image: ImageInspectInfo) {
    this.portBindingsArray.controls.splice(0, this.portBindingsArray.length);
    this.imageData = image;
    if (image) {

      const exposedPorts = Object.keys(this.imageData.Config.ExposedPorts || {})
        .map(k => parseInt(k.split('/')[0], 10));

      const out = this.suggestedPorts || [];
      this.availablePorts = out.concat(exposedPorts.filter(p => !out.some(o => o.containerPort === p)).map(p => ({ containerPort: p })));
    }
  }

  public canAddPortBinding() {
    return !this.portBindingsArray.length || !this.portBindingsArray.controls.some(c => c.invalid);
  }

  public canAddVolumeBinding() {
    return !this.volumeBindingsArray.length || !this.volumeBindingsArray.controls.some(c => c.invalid);
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

    this.daemonService.docker(d => d.createContainer(data))
      .pipe(switchMap(container => {
        this.notification.open(`Container Created. Starting.. ${container.id}`);
        return from(container.start() as Promise<Container>);
      }))
      .subscribe(container => {
        this.created.emit(container.id);
      });
  }
}
