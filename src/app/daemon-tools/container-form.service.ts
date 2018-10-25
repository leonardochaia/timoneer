import { Injectable } from '@angular/core';
import { PortBinding, VolumeBindingType, VolumeBinding } from './docker-client.model';
import { FormBuilder, Validators, AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { ContainerCreateBody, HostConfigPortBindings } from 'dockerode';

@Injectable({
  providedIn: 'root'
})
export class ContainerFormService {

  constructor(private fb: FormBuilder) { }

  public addPortBinding(portBindingsArray: FormArray, binding: Partial<PortBinding> = null) {
    binding = binding || {};
    const group = this.fb.group({
      'containerPort': [binding.containerPort, Validators.required],
      'hostPort': [binding.hostPort || binding.containerPort, Validators.required],
      'description': [binding.description],
      'assignRandomPort': [binding.assignRandomPort || false, Validators.required]
    });

    portBindingsArray.push(group);

    // Update hostPort with containerPort value
    // while hostPort is dirty.
    group.get('containerPort').valueChanges
      .pipe(takeWhile(() => group.get('hostPort').pristine))
      .subscribe(containerPort => {
        group.get('hostPort').setValue(containerPort);
      });

    // Update hostPort validators when assignRandomPort changes.
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

  public removePortBinding(portBindingsArray: FormArray, control: AbstractControl) {
    portBindingsArray.removeAt(portBindingsArray.controls.indexOf(control));
  }

  public canAddPortBinding(portBindingsArray: FormArray) {
    return !portBindingsArray.length || !portBindingsArray.controls.some(c => c.invalid);
  }

  public addVolumeBinding(volumeBindingsArray: FormArray, binding: Partial<VolumeBinding> = null) {
    binding = binding || {};
    const group = this.fb.group({
      'containerPath': [binding.containerPath, Validators.required],
      'description': [binding.description],
      'type': [binding.type || VolumeBindingType.Bind, Validators.required],
      'readonly': [binding.readonly || false],
      'hostPath': [binding.hostPath],
      'volumeName': [binding.volumeName],
    });

    volumeBindingsArray.push(group);

    // Update hostPath with containerPath value
    // while hostPath is dirty
    group.get('containerPath')
      .valueChanges
      .pipe(takeWhile(() => group.get('hostPath').pristine))
      .subscribe(containerPath => {
        group.get('hostPath').setValue(containerPath);
      });

    const updateForm = (type: VolumeBindingType) => {
      switch (type) {
        case VolumeBindingType.Volume:
          group.get('hostPath').setValidators([]);
          group.get('hostPath').disable();

          group.get('volumeName').setValidators([Validators.required]);
          group.get('volumeName').enable();
          break;

        case VolumeBindingType.Bind:
          group.get('hostPath').setValidators([Validators.required]);
          group.get('hostPath').enable();

          group.get('volumeName').setValidators([]);
          group.get('volumeName').disable();
          break;
      }
      group.get('hostPath').updateValueAndValidity();
    };

    updateForm(group.get('type').value);

    // update form when type changes
    group.get('type').valueChanges.subscribe(updateForm);
  }

  public removeVolumeBinding(volumeBindingsArray: FormArray, control: AbstractControl) {
    volumeBindingsArray.removeAt(volumeBindingsArray.controls.indexOf(control));
  }

  public canAddVolumeBinding(volumeBindingsArray: FormArray) {
    return !volumeBindingsArray.length || !volumeBindingsArray.controls.some(c => c.invalid);
  }

  public createForm(data?: ContainerCreateBody) {
    data = data || {
      Tty: true,
    };

    // Create fhe form based on the DTO
    // so that properties that we're
    // not allowing edit are kept
    const form = this.createFormGroup(data);

    // We must set the controls that we do use though
    form.setControl('Image', this.fb.control(data.Image, Validators.required));
    form.setControl('name', this.fb.control(data.name));
    form.setControl('Cmd', this.fb.control(null));
    form.setControl('Tty', this.fb.control(data.Tty));

    if (!data.HostConfig) {
      form.setControl('HostConfig', this.fb.group({}));
    }

    // Setup some healthy deaults if not provided
    if (!data.HostConfig
      || typeof data.HostConfig.AutoRemove !== 'boolean') {
      (form.get('HostConfig') as FormGroup).setControl('AutoRemove', this.fb.control(true));
    }

    if (typeof data.Tty !== 'boolean') {
      form.get('Tty').setValue(true);
    }

    if (data.Cmd && Array.isArray(data.Cmd) && data.Cmd.length) {
      form.get('Cmd').setValue(JSON.stringify(data.Cmd));
    }

    // Custom fields
    const portBindingsArray = this.fb.array([]);
    const volumeBindingsArray = this.fb.array([]);

    if (data.HostConfig) {
      if (data.HostConfig.PortBindings) {
        for (const key in data.HostConfig.PortBindings) {
          if (data.HostConfig.PortBindings.hasOwnProperty(key)) {
            const bindings = data.HostConfig.PortBindings[key] as HostConfigPortBindings[];
            const containerPort = parseInt(key.slice(0, key.indexOf('/')), 10);
            for (const binding of bindings) {
              this.addPortBinding(portBindingsArray, {
                containerPort: containerPort,
                hostPort: binding.HostPort ? parseInt(binding.HostPort, 10) : null
              });
            }
          }
        }
      }

      if (data.HostConfig.Mounts) {
        for (const mount of data.HostConfig.Mounts) {
          switch (mount.Type) {
            case VolumeBindingType.Bind:
              this.addVolumeBinding(volumeBindingsArray, {
                type: mount.Type,
                containerPath: mount.Target,
                hostPath: mount.Source,
              });
              break;
            case VolumeBindingType.Volume:
              this.addVolumeBinding(volumeBindingsArray, {
                type: mount.Type,
                volumeName: (mount as any).Name,
                containerPath: (mount as any).Destination
              });
              break;
          }
        }
      }

      if (data.HostConfig.Binds) {
        for (const bind of data.HostConfig.Binds) {
          const split = bind.split(':');
          const host = split[0];
          const containerPath = split[1];
          const readonly = split[3] === 'ro';
          if (host.startsWith('/')) {
            // Assume its a bind
            this.addVolumeBinding(volumeBindingsArray, {
              containerPath: containerPath,
              hostPath: host,
              type: VolumeBindingType.Bind,
              readonly: readonly,
            });
          } else {
            // Assume its a volume
            this.addVolumeBinding(volumeBindingsArray, {
              containerPath: containerPath,
              type: VolumeBindingType.Volume,
              volumeName: host,
              readonly: readonly,
            });
          }
        }
      }
    }

    form.setControl('portBindings', portBindingsArray);
    form.setControl('volumeBindings', volumeBindingsArray);
    return form;
  }

  public formToData(form: FormGroup) {
    const portBindingsArray = form.get('portBindings') as FormArray;
    const volumeBindingsArray = form.get('volumeBindings') as FormArray;

    const data: ContainerCreateBody = Object.assign(form.getRawValue());
    delete data['portBindings'];
    delete data['volumeBindings'];

    // Required so that attach works.
    data.OpenStdin = true;

    if (!data.HostConfig) {
      data.HostConfig = {};
    }

    // Following fields are managed by the wrappers
    data.HostConfig.PortBindings = {};
    data.HostConfig.Mounts = [];

    // Delete binds since we're using Mounts and they conflict
    delete data.HostConfig.Binds;

    for (const portMapping of portBindingsArray.controls.filter(c => c.valid).map(c => c.value as PortBinding)) {
      data.HostConfig.PortBindings[`${portMapping.containerPort}/tcp`] = [{
        HostPort: portMapping.assignRandomPort ? null : portMapping.hostPort.toString()
      }] as any;
    }

    for (const volumeMapping of volumeBindingsArray.controls.map(c => c.value as VolumeBinding)) {
      data.HostConfig.Mounts.push({
        Target: volumeMapping.containerPath,
        Source: volumeMapping.type === VolumeBindingType.Volume ? volumeMapping.volumeName : volumeMapping.hostPath,
        Type: volumeMapping.type.toString(),
        ReadOnly: volumeMapping.readonly
      });
    }

    if (data.Cmd && data.Cmd.length) {
      data.Cmd = JSON.parse(data.Cmd as any);
    }

    return data;
  }

  /**
   * Creates a FormGroup based on the provided object
   * Recursively creates FormGroup, FormArray
   * or FormControl accordingly
   * @param obj The base object
   */
  protected createFormGroup(obj: any) {
    const formGroup: { [id: string]: AbstractControl; } = {};

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (Array.isArray(value)) {
        formGroup[key] = this.fb.array(value);
      } else if (value instanceof Object) {
        formGroup[key] = this.createFormGroup(value);
      } else {
        formGroup[key] = this.fb.control(obj[key]);
      }
    });

    return this.fb.group(formGroup);
  }
}
