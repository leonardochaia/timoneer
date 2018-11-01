import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ImageSource, ImageListItemData } from '../image-source.model';
import { Subject, throwError } from 'rxjs';
import { takeUntil, startWith, switchMap, debounceTime, take, retryWhen, catchError } from 'rxjs/operators';
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

  @Output()
  public readonly titleChange = new EventEmitter<string>();

  public images: ImageListItemData[];
  public loading: boolean;
  public error: string;

  protected readonly componetDestroyed = new Subject();
  protected readonly retrySubject = new Subject();

  constructor(
    protected readonly tab: TabService,
    protected readonly notification: NotificationService) { }

  public ngOnInit() {
    this.setTitle('..');
    this.filterForm
      .valueChanges
      .pipe(
        debounceTime(250),
        startWith(null),
        switchMap((v) => {
          this.loading = true;
          return this.source.loadList(v);
        }),
        catchError(e => {
          this.loading = false;
          this.error = e.message;
          this.setTitle('errored');
          console.error(e);
          return throwError(e);
        }),
        retryWhen(errors => errors.pipe(switchMap(() => this.retrySubject.asObservable()))),
        takeUntil(this.componetDestroyed),
      )
      .subscribe(list => {
        this.loading = false;
        this.images = list;
        this.setTitle(this.images.length.toString());
      });
  }

  public retry() {
    this.loading = false;
    this.error = null;
    this.retrySubject.next();
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

  protected setTitle(status: string) {
    setTimeout(() => {
      this.titleChange.emit(`${this.source.name} (${status})`);
    });
  }
}
