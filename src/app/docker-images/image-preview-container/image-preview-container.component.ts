import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { RegistryService } from '../../registry/registry.service';
import { TAB_DATA } from '../../tabs/tab.model';
import { ImageManifest } from '../../registry/registry.model';
import { SettingsService } from '../../settings/settings.service';
import { switchMap, tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface ImagePreviewContainerComponentData {
  image: string;
}

@Component({
  selector: 'tim-image-preview-container',
  templateUrl: './image-preview-container.component.html',
  styleUrls: ['./image-preview-container.component.scss']
})
export class ImagePreviewContainerComponent implements OnInit, OnDestroy {
  public manifest: ImageManifest;
  public loading: boolean;

  protected readonly componetDestroyed = new Subject();

  constructor(
    @Inject(TAB_DATA)
    private readonly tabData: ImagePreviewContainerComponentData,
    private readonly registry: RegistryService,
    private readonly settings: SettingsService) { }

  public ngOnInit() {
    this.loading = true;

    this.settings.getImageConfig(this.tabData.image)
      .pipe(
        tap(c => console.log(JSON.stringify(c))),
        switchMap(config => this.registry.getImageManifest(config.registry.url,
          config.repository, config.tag))
      )
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(manifest => {
        this.manifest = manifest;
        this.loading = false;
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

}
