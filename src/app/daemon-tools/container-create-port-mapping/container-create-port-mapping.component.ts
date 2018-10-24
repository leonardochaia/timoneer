import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, AbstractControl } from '@angular/forms';
import { ImageInspectInfo } from 'dockerode';
import { ContainerCreationSuggestedPort, PortBinding } from '../docker-client.model';
import { ContainerFormService } from '../container-form.service';

@Component({
  selector: 'tim-container-create-port-mapping',
  templateUrl: './container-create-port-mapping.component.html',
  styleUrls: ['./container-create-port-mapping.component.scss']
})
export class ContainerCreatePortMappingComponent implements OnInit, OnChanges {

  @Input()
  public portBindingsArray: FormArray;

  @Input()
  public image: ImageInspectInfo;

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
    if (changes['image']) {
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
    if (this.image) {

      const exposedPorts = Object.keys(this.image.Config.ExposedPorts || {})
        .map(k => parseInt(k.split('/')[0], 10));

      // Remove bindings that are not in the new image
      for (const control of this.portBindingsArray.controls) {
        const value = control.value as PortBinding;
        if (!exposedPorts.includes(value.containerPort)) {
          this.containerForm.removePortBinding(this.portBindingsArray, control);
        }
      }

      const out = this.suggestedPorts || [];
      this.availablePorts = out.concat(exposedPorts.filter(p => !out.some(o => o.containerPort === p))
        .map(p => ({ containerPort: p })));
    }
  }
}
