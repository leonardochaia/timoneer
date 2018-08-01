import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { ImageInspectInfo } from 'dockerode';
import { ContainerCreationSuggestedPort, PortBinding } from '../docker-client.model';

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

  constructor(private fb: FormBuilder) { }

  public ngOnInit() {
    this.availablePorts = this.suggestedPorts || [];
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['image']) {
      this.onImageChanged();
    }
  }

  public addPortBinding(binding: Partial<PortBinding> = null) {
    binding = binding || {};
    const group = this.fb.group({
      'containerPort': [binding.containerPort, Validators.required],
      'hostPort': [binding.hostPort || binding.containerPort, Validators.required],
      'description': [binding.description],
      'assignRandomPort': [binding.assignRandomPort || false, Validators.required]
    });

    this.portBindingsArray.push(group);

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

  public removePortBinding(control: AbstractControl) {
    this.portBindingsArray.removeAt(this.portBindingsArray.controls.indexOf(control));
  }

  public canAddPortBinding() {
    return !this.portBindingsArray.length || !this.portBindingsArray.controls.some(c => c.invalid);
  }

  protected clearPorts() {
    this.portBindingsArray.controls.splice(0, this.portBindingsArray.length);
  }

  protected onImageChanged() {
    this.clearPorts();
    if (this.image) {

      const exposedPorts = Object.keys(this.image.Config.ExposedPorts || {})
        .map(k => parseInt(k.split('/')[0], 10));

      const out = this.suggestedPorts || [];
      this.availablePorts = out.concat(exposedPorts.filter(p => !out.some(o => o.containerPort === p))
        .map(p => ({ containerPort: p })));
    }
  }
}
