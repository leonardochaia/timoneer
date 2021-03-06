import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, AbstractControl } from '@angular/forms';
import { ContainerCreationSuggestedPort, PortBinding } from '../docker-client.model';
import { ContainerFormService } from '../container-form.service';
import { ImageInfoContainerConfig } from '../../docker-images/image-source.model';

@Component({
  selector: 'tim-container-create-port-mapping',
  templateUrl: './container-create-port-mapping.component.html',
  styleUrls: ['./container-create-port-mapping.component.scss']
})
export class ContainerCreatePortMappingComponent implements OnInit, OnChanges {

  @Input()
  public portBindingsArray: FormArray;

  @Input()
  public imageInfo: ImageInfoContainerConfig;

  @Input()
  public suggestedPorts: ContainerCreationSuggestedPort[];

  public get filteredPorts() {
    return this.availablePorts.filter(p => !this.portBindingsArray.controls.some(c => c.value.containerPort === p.containerPort));
  }

  private availablePorts: ContainerCreationSuggestedPort[];

  constructor(private containerForm: ContainerFormService) { }

  public ngOnInit() {
    this.availablePorts = this.suggestedPorts || [];
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['imageInfo']) {
      this.onImageChanged();
    }
  }

  public addPortBinding(binding: Partial<PortBinding> = null) {
    this.containerForm.addPortBinding(this.portBindingsArray, binding);
  }

  public removePortBinding(control: AbstractControl) {
    this.containerForm.removePortBinding(this.portBindingsArray, control);
  }

  public canAddPortBinding() {
    return this.containerForm.canAddPortBinding(this.portBindingsArray);
  }

  protected onImageChanged() {
    if (this.imageInfo) {

      const exposedPorts = Object.keys(this.imageInfo.ExposedPorts || {})
        .map(k => parseInt(k.split('/')[0], 10));

      const out = this.suggestedPorts || [];
      this.availablePorts = out.concat(exposedPorts.filter(p => !out.some(o => o.containerPort === p))
        .map(p => ({ containerPort: p })));
    }
  }
}
