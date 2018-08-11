import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ImageInfo } from 'dockerode';
import { DockerImageService } from '../docker-image.service';
import { ImageActionsSheetComponent } from '../image-actions-sheet/image-actions-sheet.component';
import { MatBottomSheet } from '@angular/material';
import { DockerEventsService } from '../docker-events.service';

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

  constructor(private imageService: DockerImageService,
    private fb: FormBuilder,
    private daemonEvents: DockerEventsService,
    private bottomSheet: MatBottomSheet) {

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

    this.daemonEvents.bindAll(['delete', 'import', 'load', 'pull', 'tag', 'untag'], 'image')
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(() => {
        this.reload();
      });
  }

  public ngOnInit() {
    this.reload();
  }

  public isImageDangling(image: ImageInfo) {
    return image.RepoTags && image.RepoTags[0] === '<none>:<none>';
  }

  public openImageMenu(image: ImageInfo) {
    this.bottomSheet.open(ImageActionsSheetComponent, {
      data: image
    }).afterDismissed().subscribe(reload => {
      if (reload) {
        this.reload();
      }
    });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  private reload() {
    this.imageService.imageList()
      .pipe(takeUntil(this.componetDestroyed))
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
