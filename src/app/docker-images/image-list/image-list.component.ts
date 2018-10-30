import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ImageSource, ImageListItemData } from '../image-source.model';
import { Subject } from 'rxjs';
import { takeUntil, startWith, switchMap, debounceTime } from 'rxjs/operators';
import { TimoneerTabs } from '../../timoneer-tabs';
import { ImagePreviewContainerComponentData } from '../image-preview-container/image-preview-container.component';
import { TabService } from '../../tabs/tab.service';
import { FormGroup } from '@angular/forms';
import { ContainerCreateBody } from 'dockerode';
import { NotificationService } from '../../shared/notification.service';
import { isValidImageName } from '../image-tools';

@Component({
  selector: 'tim-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit, OnDestroy {

  @Input()
  public filterForm: FormGroup;

  @Input()
  public source: ImageSource;

  public images: ImageListItemData[];
  public loading: boolean;
  public error: string;
  public title: string;

  protected readonly componetDestroyed = new Subject();

  constructor(
    protected readonly tab: TabService,
    protected readonly notification: NotificationService) { }

  public ngOnInit() {
    this.title = `${this.source.name} (..)`;
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
        this.title = `${this.source.name} (${this.images.length})`;
      }, e => {
        this.loading = false;
        this.error = e.message;
        this.title = `${this.source.name} (errored)`;
        console.error(e);
      });
  }

  public imageInfo(image: ImageListItemData) {
    this.tab.add(TimoneerTabs.IMAGE_PREVIEW, {
      title: image.name,
      params: {
        image: isValidImageName(image.name) ? image.name : image.id,
        registryDNS: this.source.registryDNS
      } as ImagePreviewContainerComponentData
    });
  }

  public createContainer(image: ImageListItemData) {
    this.tab.add(TimoneerTabs.DOCKER_CONTAINER_NEW, {
      params: {
        Image: isValidImageName(image.name) ? image.name : image.id
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
