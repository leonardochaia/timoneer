import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DaemonService } from '../daemon.service';
import { finalize } from 'rxjs/operators';
import { DockerStreamResponse } from '../docker-client.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'tim-image-pull-modal',
  templateUrl: './image-pull-modal.component.html',
  styleUrls: ['./image-pull-modal.component.scss']
})
export class ImagePullModalComponent implements OnInit {
  public image: string;

  public title: string;

  public imageLogs$: Observable<DockerStreamResponse>;

  public finished: boolean;

  constructor(private daemonService: DaemonService,
    private dialogRef: MatDialogRef<ImagePullModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    data: { image: string }) {
    this.image = data.image;
  }

  public ngOnInit() {
    this.title = `Pulling ${this.image}`;
    this.finished = false;
    this.imageLogs$ = this.daemonService.pullImage(this.image)
      .pipe(
        finalize(() => {
          this.title = `Finished pulling ${this.image}`;
          this.finished = true;
        }));
  }

  public cancel() {
    this.dialogRef.close();
  }
}
