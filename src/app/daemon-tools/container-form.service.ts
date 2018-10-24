import { Injectable } from '@angular/core';
import { PortBinding } from './docker-client.model';
import { FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { ContainerCreateBody } from 'dockerode';

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

  public clearPortBindings(portBindingsArray: FormArray) {
    portBindingsArray.controls.splice(0, portBindingsArray.length);
  }

  protected createForm(data: ContainerCreateBody) {
    data = data || {
      Tty: true,
    };

    const form = this.fb.group({
      'Image': [data.Image, Validators.required],
      'name': [data.name],
      'Cmd': [data.Cmd],
      'Tty': [data.Tty, Validators.required],

      // Custom wrappers fields
      'portBindings': this.fb.array([]),
      'volumeBindings': this.fb.array([]),
    });

    if (data.HostConfig) {
      if (data.HostConfig.PortBindings) {
        for (const key in data.HostConfig.PortBindings) {
          if (data.HostConfig.PortBindings.hasOwnProperty(key)) {
            const binding = data.HostConfig.PortBindings[key];
            const containerPort = parseInt(key.slice(0, key.indexOf('/')), 10);

          }
        }
      }
    }

    // for (const portMapping of portBindingsArray.controls.map(c => c.value as PortBinding)) {
    //   data.HostConfig.PortBindings[`${portMapping.containerPort}/tcp`] = [{
    //     HostPort: portMapping.assignRandomPort ? null : portMapping.hostPort.toString()
    //   }] as any;
    // }

    return form;
  }
}
