import { Component, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { VolumeBinding, ContainerCreationSuggestedVolume, VolumeBindingType } from '../docker-client.model';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'tim-container-create-volume-mapping',
  templateUrl: './container-create-volume-mapping.component.html',
  styleUrls: ['./container-create-volume-mapping.component.scss']
})
export class ContainerCreateVolumeMappingComponent {

  public VolumeBindingType = VolumeBindingType;

  @Input()
  public volumeBindingsArray: FormArray;

  @Input()
  public suggestedVolumes: ContainerCreationSuggestedVolume[];

  public get filteredVolumes() {
    if (this.suggestedVolumes) {
      return this.suggestedVolumes
        .filter(p => !this.volumeBindingsArray.controls.some(c => c.value.containerPath === p.containerPath));
    } else {
      return [];
    }
  }

  constructor(private fb: FormBuilder) { }

  public addVolumeBinding(binding: Partial<VolumeBinding> = null) {
    binding = binding || {};
    const group = this.fb.group({
      'containerPath': [binding.containerPath, Validators.required],
      'description': [binding.description],
      'type': [binding.type || VolumeBindingType.Bind, Validators.required],
      'readonly': [binding.readonly || false],
      'hostPath': [binding.hostPath],
      'volumeName': [binding.volumeName],
    });

    this.volumeBindingsArray.push(group);

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

  public removeVolumeBinding(control: AbstractControl) {
    this.volumeBindingsArray.removeAt(this.volumeBindingsArray.controls.indexOf(control));
  }

  public canAddVolumeBinding() {
    return !this.volumeBindingsArray.length || !this.volumeBindingsArray.controls.some(c => c.invalid);
  }
}
