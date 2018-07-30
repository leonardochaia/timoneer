import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, forwardRef } from '@angular/core';
import { map, switchMap, debounceTime, catchError, take } from 'rxjs/operators';
import { Subject, Observable, of, throwError, forkJoin } from 'rxjs';
import { DaemonService } from '../daemon.service';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RegistryService } from '../../registry/registry.service';
import { SettingsService } from '../../settings/settings.service';
import { DaemonModalService } from '../daemon-modal.service';
import { ImageInspectInfo } from 'dockerode';

export const DEFAULT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImageSelectorCardComponent),
  multi: true
};

@Component({
  selector: 'tim-image-selector-card',
  templateUrl: './image-selector-card.component.html',
  styleUrls: ['./image-selector-card.component.scss'],
  providers: [DEFAULT_VALUE_ACCESSOR]
})
export class ImageSelectorCardComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Output()
  public imageLoaded = new EventEmitter<ImageInspectInfo>();

  @Input()
  public showDaemonImages = true;

  public get image() {
    return this.imageSelectControl.value as string;
  }

  public set image(value: string) {
    this.imageSelectControl.setValue(value);
  }

  public disabled: boolean;
  public imageTags: string[];
  public imageData: ImageInspectInfo;
  public loadingImageData: boolean;
  public imageNotFound: boolean;
  public imageError: string;
  public imageSelectControl = new FormControl();
  public registries: Observable<{ name: string, repos: string[] }[]>;

  private componetDestroyed = new Subject();
  private onChanges: (image: string) => void;

  constructor(private daemonService: DaemonService,
    private settingsService: SettingsService,
    private modalService: DaemonModalService,
    private registryService: RegistryService) { }

  public ngOnInit() {
    if (this.image && this.image.length) {
      this.loadImageMetadata();
    }

    this.registries = this.imageSelectControl.valueChanges.pipe(
      debounceTime(500),
      switchMap(term => this.filterRepos(term))
    );
    this.imageSelectControl.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(() => this.onImageSelected());
  }

  public writeValue(image: string): void {
    this.image = image;
  }

  public registerOnChange(fn: (image: string) => void): void {
    this.onChanges = fn;
  }

  public registerOnTouched(fn: () => void): void {
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.imageSelectControl.disable();
    } else {
      this.imageSelectControl.enable();
    }
  }

  public clearImageData() {
    this.imageData = this.imageTags = this.imageError = null;
    this.imageNotFound = false;
  }

  public onImageSelected() {
    this.clearImageData();
    this.loadImageMetadata();
    this.triggerOnChanges();
  }

  public pullImage() {
    this.modalService.pullImageDialog(this.image);
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  public tagChanged(tag: string) {
    if (this.image.includes(':')) {
      const repo = this.image.split(':')[0];
      this.image = `${repo}:${tag}`;
    } else {
      this.image += `:${tag}`;
    }
  }

  private triggerOnChanges() {
    if (this.onChanges) {
      this.onChanges(this.image);
    }
  }
  private getDameonImages() {
    return this.daemonService.docker(d => d.listImages())
      .pipe(
        map(images => [{
          name: 'Docker Daemon',
          repos: Array.prototype.concat.apply([], images.filter(i => i.RepoTags && i.RepoTags.length).map(i => i.RepoTags))
        }])
      );
  }

  private filterRepos(term: string) {
    return this.registryService.getRepositoriesFromAllRegistries()
      .pipe(
        switchMap(results => this.showDaemonImages ? this.getDameonImages().pipe(map(daemon => results.concat(daemon))) : of(results)),
        map(repos => {

          if (!term || !term.length) {
            return repos;
          }

          for (const repo of repos) {
            repo.repos = repo.repos.filter(r => r.includes(term));
          }

          return repos.filter(r => r.repos.length);
        }),
    );
  }

  private loadImageTags() {
    let repo = this.image.includes('/') ? this.image.split('/')[1] : this.image;
    repo = repo.includes(':') ? repo.split(':')[0] : repo;
    return this.settingsService.getRegistrySettingsForImage(this.image)
      .pipe(
        switchMap(settings => settings.allowsCatalog ? this.registryService.getRepoTags(settings.url, repo) : of([])),
        map(tags => {
          return this.imageTags = tags;
        })
      );
  }

  private loadImageMetadata() {
    if (!this.image) {
      return;
    }

    this.loadingImageData = true;
    const inspect = this.daemonService.docker(d => d.getImage(encodeURI(this.image)).inspect())
      .pipe(
        map(image => {
          this.imageData = image;
          this.imageLoaded.emit(this.imageData);
          return this.imageData;
        }),
        catchError((e: { reason: string, statusCode: number }) => {
          if (e.statusCode === 404) {
            this.imageNotFound = true;
          }
          this.imageError = e.reason;
          return throwError(e);
        })
      );

    forkJoin([
      inspect.pipe(take(1)),
      this.loadImageTags().pipe(take(1)),
    ])
      .pipe(catchError((e) => {
        this.imageError = e.message;
        this.loadingImageData = false;
        return throwError(e);
      }))
      .subscribe(() => {
        this.loadingImageData = false;
      });
  }

}
