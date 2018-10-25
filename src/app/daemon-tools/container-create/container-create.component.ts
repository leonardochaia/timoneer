import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ImageInspectInfo, ContainerCreateBody } from 'dockerode';
import {
  ContainerCreationSuggestedPort, ContainerCreationSuggestedVolume
} from '../docker-client.model';
import { DockerJobsService } from '../docker-jobs.service';
import { JobInstance } from '../../jobs/job-instance';
import { ContainerCreationJob } from '../container-creation-job';
import { ContainerFormService } from '../container-form.service';

@Component({
  selector: 'tim-container-create',
  templateUrl: './container-create.component.html',
  styleUrls: ['./container-create.component.scss']
})
export class ContainerCreateComponent implements OnInit {

  @Input()
  public initialConfig: ContainerCreateBody;

  @Input()
  public disableImage = false;

  @Input()
  public suggestedPorts: ContainerCreationSuggestedPort[];

  @Input()
  public suggestedVolumes: ContainerCreationSuggestedVolume[];

  @Output()
  public created = new EventEmitter<JobInstance<ContainerCreationJob, string>>();

  public form: FormGroup;

  public get portBindingsArray() {
    return this.form.get('portBindings') as FormArray;
  }

  public get volumeBindingsArray() {
    return this.form.get('volumeBindings') as FormArray;
  }

  public imageData: ImageInspectInfo;

  constructor(private dockerJobs: DockerJobsService,
    private containerForm: ContainerFormService) {
  }

  public ngOnInit() {
    this.form = this.containerForm.createForm(this.initialConfig);
    if (this.disableImage) {
      const imgCtrl = this.form.get('Image');
      imgCtrl.disable();
    }
  }

  public imageSelected(image: ImageInspectInfo) {
    this.imageData = image;
  }

  public launch() {
    const data = this.containerForm.formToData(this.form);
    const job = this.dockerJobs.createContainer(data);
    this.created.emit(job);
  }
}
