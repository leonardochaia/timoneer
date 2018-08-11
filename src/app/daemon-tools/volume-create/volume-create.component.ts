import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DockerVolumeService } from '../docker-volume.service';
import { VolumeInfo } from 'dockerode';

@Component({
  selector: 'tim-volume-create',
  templateUrl: './volume-create.component.html',
  styleUrls: ['./volume-create.component.scss']
})
export class VolumeCreateComponent implements OnInit {

  @Output()
  public created = new EventEmitter<VolumeInfo>();

  public form = this.fb.group({
    'Name': ['', Validators.required],
  });

  constructor(private fb: FormBuilder,
    private volumeService: DockerVolumeService) { }

  public ngOnInit() {
  }

  public create() {
    this.volumeService.createVolume(this.form.value)
      .subscribe(volume => {
        this.created.emit(volume);
      });
  }
}
