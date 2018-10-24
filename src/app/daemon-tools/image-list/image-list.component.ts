import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Observable, throwError } from 'rxjs';
import { takeUntil, catchError, map } from 'rxjs/operators';
import { ImageInfo, ContainerCreateBody } from 'dockerode';
import { DockerImageService } from '../docker-image.service';
import { DockerEventsService } from '../docker-events.service';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';
import { NotificationService } from '../../shared/notification.service';

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

  public loadingMap = new Map<string, boolean>();

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
    private notificationService: NotificationService,
    private tabService: TabService) {

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

  public deleteImage(image: ImageInfo) {
    this.bindLoading(image, this.imageService.removeImage(image.Id))
      .subscribe(() => {
        this.notificationService.open(`${image.RepoTags[0]} has been removed removed.`);
      });
  }

  public createContainer(image: ImageInfo) {
    this.tabService.add(TimoneerTabs.DOCKER_CONTAINER_NEW, {
      params: {
        Image: image.RepoTags[0] || image.Id
      } as ContainerCreateBody
    });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  private bindLoading(image: ImageInfo, obs: Observable<any>) {
    this.loadingMap.set(image.Id, true);
    return obs.pipe(
      catchError((e) => {
        this.loadingMap.set(image.Id, false);
        this.notificationService.open(e.message, null, {
          panelClass: 'tim-bg-warn',
        });
        return throwError(e);
      }),
      map(r => {
        this.loadingMap.set(image.Id, false);
        return r;
      })
    );
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
