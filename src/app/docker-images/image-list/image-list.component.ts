import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ImageSource, ImageListItemData, ImageSourceDeletion } from '../image-source.model';
import { Subject } from 'rxjs';
import { takeUntil, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { TimoneerTabs } from '../../timoneer-tabs';
import { ImagePreviewContainerComponentData } from '../image-preview-container/image-preview-container.component';
import { TabService } from '../../tabs/tab.service';
import { FormGroup } from '@angular/forms';
import { ContainerCreateBody } from 'dockerode';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'tim-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit, OnDestroy {

  @Input()
  public filterForm: FormGroup;

  @Input()
  public source: ImageSource & ImageSourceDeletion;

  public images: ImageListItemData[];
  public loading: boolean;
  public error: string;

  protected readonly componetDestroyed = new Subject();

  constructor(
    protected readonly tab: TabService,
    protected readonly notification: NotificationService) { }

  public ngOnInit() {
    this.filterForm
      .valueChanges
      .pipe(
        debounceTime(250),
        takeUntil(this.componetDestroyed),
        startWith(null),
        switchMap((v) => {
          this.loading = true;
          return this.source.loadList(v);
        })
      )
      .subscribe(list => {
        this.loading = false;
        this.images = list;
      }, e => {
        this.loading = false;
        this.error = e.message;
        console.error(e);
      });
  }

  public imageInfo(image: ImageListItemData) {
    this.tab.add(TimoneerTabs.IMAGE_PREVIEW, {
      title: image.name,
      params: {
        image: image.name,
      } as ImagePreviewContainerComponentData
    });
  }

  public createContainer(image: ImageListItemData) {
    this.tab.add(TimoneerTabs.DOCKER_CONTAINER_NEW, {
      params: {
        Image: image.name
      } as ContainerCreateBody
    });
  }

  public deleteImage(image: ImageListItemData) {
    this.source.deleteImage(image.id || image.name)
      .subscribe(() => {
        this.notification.open(`${image.name} has been removed.`);
      }, e => {
        this.notification.open(e.message, null, {
          panelClass: 'tim-bg-warn',
        });
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
