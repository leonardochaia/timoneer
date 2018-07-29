import { Component, OnInit, OnDestroy } from '@angular/core';
import { DaemonService } from '../daemon.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ImageInfo } from 'dockerode';

@Component({
  selector: 'tim-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit, OnDestroy {
  public originalImages: ImageInfo[];
  public images: ImageInfo[];
  public danglingAmount: number;

  public filterForm: FormGroup;

  public get displayDanlingImagesControl() {
    return this.filterForm.controls['displayDanglingImages'];
  }

  public get searchTermControl() {
    return this.filterForm.controls['searchTerm'];
  }

  private componetDestroyed = new Subject();

  constructor(private daemonService: DaemonService,
    private fb: FormBuilder) {

    this.filterForm = this.fb.group({
      displayDanglingImages: [false],
      searchTerm: ['']
    });

    this.filterForm
      .valueChanges
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(() => {
        this.processFilter();
      });
  }

  public ngOnInit() {
    this.reload();
  }

  public isImageDangling(image: ImageInfo) {
    return image.RepoTags && image.RepoTags[0] === '<none>:<none>';
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  private reload() {
    this.daemonService.docker(d => d.listImages())
      .pipe(
        takeUntil(this.componetDestroyed)
      )
      .subscribe(images => {
        this.originalImages = this.images = images;
        this.danglingAmount = this.originalImages.filter(i => this.isImageDangling(i)).length;
        this.processFilter();
      });
  }

  private processFilter() {
    const dangling = this.displayDanlingImagesControl.value as boolean;
    this.images = this.originalImages.filter(i => this.isImageDangling(i) === dangling);

    const term = this.searchTermControl.value as string;
    if (term && term.length) {
      this.images = this.images.filter(i => i.Id.includes(term) || i.RepoTags.some(t => t.includes(term)));
    }
  }

}
