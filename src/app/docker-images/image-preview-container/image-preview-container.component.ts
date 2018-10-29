import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { TAB_DATA } from '../../tabs/tab.model';
import { ImageSourceService } from '../image-source.service';
import { ImageSource } from '../image-source.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface ImagePreviewContainerComponentData {
  image: string;
  registryDNS: string;
}

@Component({
  selector: 'tim-image-preview-container',
  templateUrl: './image-preview-container.component.html',
  styleUrls: ['./image-preview-container.component.scss']
})
export class ImagePreviewContainerComponent implements OnInit, OnDestroy {
  public source: ImageSource;

  public get image() {
    return this.tabData.image;
  }

  protected readonly componetDestroyed = new Subject();

  constructor(
    @Inject(TAB_DATA)
    private readonly tabData: ImagePreviewContainerComponentData,
    private readonly imageSource: ImageSourceService) { }

  public ngOnInit() {
    this.imageSource.getForDNS(this.tabData.registryDNS)
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(source => {
        this.source = source;
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
