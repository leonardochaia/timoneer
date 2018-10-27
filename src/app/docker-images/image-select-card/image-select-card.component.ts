import { Component, OnInit, OnDestroy, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validators } from '@angular/forms';
import { Subject, Observable, throwError } from 'rxjs';
import { ImageSourceService } from '../image-source.service';
import { ImageSource, ImageListFilter, ImageListItemData, ImageInfo } from '../image-source.model';
import { debounceTime, distinct, switchMap, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { DockerJobsService } from '../../daemon-tools/docker-jobs.service';
import { DockerImageService } from '../../daemon-tools/docker-image.service';

export const DEFAULT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImageSelectCardComponent),
  multi: true
};

export class ImageSelectorItem {
  public loading = true;
  public error: string;
  public images: ImageListItemData[] = [];

  constructor(
    filter: ImageListFilter,
    public readonly source: ImageSource,
    cancellationToken: Observable<void>) {

    source.loadList(filter)
      .pipe(takeUntil(cancellationToken))
      .subscribe(images => {
        this.error = null;
        this.images = images;
        this.loading = false;
      }, e => {
        this.error = e.message;
        this.loading = false;
        console.error(e);
        return [];
      });
  }
}

@Component({
  selector: 'tim-image-select-card',
  templateUrl: './image-select-card.component.html',
  styleUrls: ['./image-select-card.component.scss'],
  providers: [DEFAULT_VALUE_ACCESSOR]
})
export class ImageSelectCardComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Output()
  public imageChanged = new EventEmitter<ImageInfo>();

  public currentSelectItems: ImageSelectorItem[];


  public disabled = false;
  public imageSelectControl = new FormControl(null, Validators.required);
  public tagControl = new FormControl(null, Validators.required);
  public currentImage: string;
  public currentImageInfo: ImageInfo;
  public currentImageSource: ImageSource;
  public imageExistsOnDaemon = false;
  public checkingImageExistance = false;

  private componetDestroyed = new Subject();
  private listCancellationToken: Subject<void>;
  private infoCancellationToken: Subject<void>;
  private onChanges: (image: string) => void;

  constructor(
    private readonly imageSource: ImageSourceService,
    private readonly dockerImage: DockerImageService,
    private readonly dockerJobs: DockerJobsService) { }

  public ngOnInit() {

    this.imageSelectControl.valueChanges
      .pipe(
        debounceTime(500),
        distinct(),
        switchMap((term: string) => {
          // When a new search happens, cancel pending searches
          this.cancelListLoads();
          this.listCancellationToken = new Subject<void>();

          const filter: ImageListFilter = { term: term };
          return this.imageSource.sources
            .pipe(map(sources => sources.map(source => new ImageSelectorItem(filter, source, this.listCancellationToken))));
        }),
        takeUntil(this.componetDestroyed),
      )
      .subscribe(items => {
        this.currentSelectItems = items;
      });

    this.tagControl.valueChanges
      .pipe(
        takeUntil(this.componetDestroyed),
      )
      .subscribe(tag => {

        // Override the tag with the one selected
        const image = this.removeTag(this.currentImage) + `:${tag}`;
        this.triggerOnChanges(image);
        this.checkImageExistance(image);
      });
  }

  public writeValue(image: string): void {
    this.imageSelectControl.setValue(image);
    this.selectImage(image);
  }

  public registerOnChange(fn: (image: string) => void): void {
    this.onChanges = fn;
  }

  public registerOnTouched(fn: () => void): void {
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public optionToDisplayName = (image: string) => {
    return image ? this.removeTag(image) : undefined;
  }

  public imageSelected(event: MatAutocompleteSelectedEvent) {
    const image = event.option.value as string;

    this.selectImage(image);
  }

  public onSelectClosed() {
    this.cancelListLoads();
  }

  public pullImage() {
    this.dockerJobs.pullImage(this.currentImage);
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  protected selectImage(image: string) {
    this.imageSource.getForImage(image)
      .subscribe(source => {
        this.currentImageSource = source;
        this.currentImage = image;

        // Clear the image until a tag is selected
        this.triggerOnChanges(null);

        if (this.infoCancellationToken) {
          this.infoCancellationToken.next();
          this.infoCancellationToken.complete();
        }

        this.infoCancellationToken = new Subject<void>();

        source.loadImageInfo(image)
          .pipe(
            takeUntil(this.componetDestroyed),
            takeUntil(this.infoCancellationToken)
          )
          .subscribe(imageInfo => {
            this.currentImageInfo = imageInfo;
            this.imageChanged.emit(imageInfo);
          });
      });
  }

  protected checkImageExistance(image: string) {
    this.checkingImageExistance = true;
    this.dockerImage.inspectImage(image)
      .pipe(
        takeUntil(this.componetDestroyed),
        takeUntil(this.infoCancellationToken)
      ).subscribe(() => {
        this.checkingImageExistance = false;
        this.imageExistsOnDaemon = true;
      }, (e: { reason: string, statusCode: number }) => {
        if (e.statusCode === 404) {
          this.checkingImageExistance = false;
          this.imageExistsOnDaemon = false;
        } else {
          return throwError(e);
        }
      });
  }

  protected cancelListLoads() {
    if (this.listCancellationToken) {
      this.listCancellationToken.next();
      this.listCancellationToken.complete();
      this.listCancellationToken = null;
    }
  }

  protected triggerOnChanges(image: string) {
    if (this.onChanges) {
      this.onChanges(image);
    }
  }

  protected removeTag(image: string) {
    if (image.includes(':')) {
      return image.slice(0, image.lastIndexOf(':'));
    } else {
      return image;
    }
  }
}
