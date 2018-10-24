import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, AbstractControl } from '@angular/forms';
import { ContainerCreationSuggestedVolume, VolumeBindingType, VolumeBinding } from '../docker-client.model';
import { takeUntil } from 'rxjs/operators';
import { DockerVolumeService } from '../docker-volume.service';
import { VolumeInfo } from 'dockerode';
import { Observable, Subject } from 'rxjs';
import { ContainerFormService } from '../container-form.service';

@Component({
  selector: 'tim-container-create-volume-mapping',
  templateUrl: './container-create-volume-mapping.component.html',
  styleUrls: ['./container-create-volume-mapping.component.scss']
})
export class ContainerCreateVolumeMappingComponent implements OnInit, OnDestroy {

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

  public availableVolumes$: Observable<VolumeInfo[]>;

  private componetDestroyed = new Subject();

  constructor(
    private readonly volume: DockerVolumeService,
    private readonly containerForm: ContainerFormService) { }

  public ngOnInit() {
    this.availableVolumes$ = this.volume.list()
      .pipe(
        takeUntil(this.componetDestroyed)
      );
  }

  public addVolumeBinding(binding: Partial<VolumeBinding> = null) {
    this.containerForm.addVolumeBinding(this.volumeBindingsArray, binding);
  }

  public removeVolumeBinding(control: AbstractControl) {
    this.containerForm.removeVolumeBinding(this.volumeBindingsArray, control);
  }

  public canAddVolumeBinding() {
    return this.containerForm.canAddVolumeBinding(this.volumeBindingsArray);
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
