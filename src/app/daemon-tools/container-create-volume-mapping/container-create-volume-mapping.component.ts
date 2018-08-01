import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { VolumeBinding, ContainerCreationSuggestedVolume } from '../docker-client.model';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'tim-container-create-volume-mapping',
  templateUrl: './container-create-volume-mapping.component.html',
  styleUrls: ['./container-create-volume-mapping.component.scss']
})
export class ContainerCreateVolumeMappingComponent implements OnInit {

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

  public ngOnInit() {
  }

  public addVolumeBinding(binding: Partial<VolumeBinding> = null) {
    binding = binding || {};
    const group = this.fb.group({
      'containerPath': [binding.containerPath, Validators.required],
      'hostPath': [binding.hostPath, Validators.required],
      'description': [binding.description],
      'readonly': [binding.readonly || false, Validators.required]
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
  }

  public removeVolumeBinding(control: AbstractControl) {
    this.volumeBindingsArray.removeAt(this.volumeBindingsArray.controls.indexOf(control));
  }

  public canAddVolumeBinding() {
    return !this.volumeBindingsArray.length || !this.volumeBindingsArray.controls.some(c => c.invalid);
  }
}
