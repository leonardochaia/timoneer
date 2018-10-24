import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, forwardRef } from '@angular/core';
import { map, switchMap, debounceTime, catchError, take, filter, distinct } from 'rxjs/operators';
import { Subject, Observable, of, throwError, forkJoin } from 'rxjs';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { RegistryService } from '../../registry/registry.service';
import { SettingsService } from '../../settings/settings.service';
import { ImageInspectInfo, ImageInfo } from 'dockerode';
import { DockerImageService } from '../docker-image.service';
import { DockerJobsService } from '../docker-jobs.service';
import { DockerHubService } from '../../docker-hub/docker-hub.service';
import { DockerHubRepository } from '../../docker-hub/docker-hub.model';

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
  public dockerHubData: DockerHubRepository;
  public loadingImageData: boolean;
  public imageNotFound: boolean;
  public imageError: string;
  public imageSelectControl = new FormControl(null, Validators.required);
  public registries: Observable<{ name: string, repos: string[] }[]>;

  private componetDestroyed = new Subject();
  private onChanges: (image: string) => void;

  constructor(private imageService: DockerImageService,
    private settingsService: SettingsService,
    private dockerJobs: DockerJobsService,
    private dockerHub: DockerHubService,
    private registryService: RegistryService) { }

  public ngOnInit() {
    if (this.image && this.image.length) {
      this.loadImageMetadata();
    }

    this.registries = this.imageSelectControl.valueChanges
      .pipe(
        debounceTime(500),
        distinct(),
        switchMap(term => this.filterRepos(term))
      );

    this.imageSelectControl.valueChanges
      .pipe(
        debounceTime(600),
        distinct()
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
    this.imageData = this.imageTags = this.imageError = this.dockerHubData = null;
    this.imageNotFound = false;
  }

  public onImageSelected() {
    this.clearImageData();
    this.loadImageMetadata();
    this.triggerOnChanges();
  }

  public pullImage() {
    this.dockerJobs.pullImage(this.image);
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
    if (this.showDaemonImages) {
      return this.imageService.imageList()
        .pipe(
          map(info => Array.prototype.concat.apply([], info.filter(i => i.RepoTags && i.RepoTags.length).map(i => i.RepoTags)) as string[]),
          // image to repo
          map(info => info.map(s => s.includes(':') ? s.slice(0, s.indexOf(':')) : s)),
          map(images => [{
            name: 'Docker Daemon',
            repos: images
          }]),
        );
    } else {
      return of([]);
    }
  }

  private getMyDockerHubImages() {
    return this.settingsService.getDockerIOSettings()
      .pipe(switchMap(settings => {
        if (settings.username && settings.password) {
          return this.dockerHub.getReposForUser(null)
            .pipe(
              map(r => r.results),
              map(images => [{
                name: `Docker Hub ${settings.username}`,
                repos: Array.prototype.concat.apply([], images.map(i => `${i.namespace}/${i.name}`))
              }])
            );
        } else {
          return of([]);
        }
      }));
  }

  private getDockerHubImages(term: string) {
    if (term) {
      return this.imageService.searchDockerHub(term)
        .pipe(map(repos => [{
          name: `Docker Hub Public`,
          repos: repos.map(r => r.name)
        }]));
    } else {
      return of([]);
    }
  }

  private filterRepos(term: string) {
    return this.registryService.getRepositoriesFromAllRegistries()
      .pipe(
        catchError(e => of([])),
        switchMap(results => this.getDameonImages().pipe(map(daemon => results.concat(daemon)))),
        switchMap(results => this.getMyDockerHubImages().pipe(map(hub => results.concat(hub)))),
        switchMap(results => this.getDockerHubImages(term).pipe(map(hub => results.concat(hub)))),
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

  private loadImageTagsFromDockerHub(repo: string) {
    return this.dockerHub.getRepositoryTags(repo)
      .pipe(
        map(r => r.results),
        map(tags => tags.map(t => t.name)),
        catchError(e => [])
      );
  }

  private loadImageTags() {
    let repo = this.image.includes('/') ? this.image.split('/')[1] : this.image;
    repo = repo.includes(':') ? repo.split(':')[0] : repo;
    return this.settingsService.getRegistrySettingsForImage(this.image)
      .pipe(
        switchMap(settings => {
          if (settings && settings.allowsCatalog) {
            return this.registryService.getRepoTags(settings.url, repo);
          } else {
            return this.loadImageTagsFromDockerHub(this.image);
          }
        }),
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
    const inspect = this.imageService.inspectImage(this.image)
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
          // dont throw an error.
          return of(null);
        })
      );

    const hubInfo = this.dockerHub.getRepository(this.image)
      .pipe(
        map(repo => this.dockerHubData = repo),
        catchError(e => {
          return of(null);
        }));

    const tags = this.loadImageTags()
      .pipe(catchError(e => {
        this.imageError = e.message;
        return of(null);
      }));

    forkJoin([
      inspect.pipe(take(1)),
      hubInfo.pipe(take(1)),
      tags.pipe(take(1)),
    ])
      .pipe(catchError((e) => {
        this.loadingImageData = false;
        return throwError(e);
      }))
      .subscribe(() => {
        this.loadingImageData = false;
      });
  }

}
