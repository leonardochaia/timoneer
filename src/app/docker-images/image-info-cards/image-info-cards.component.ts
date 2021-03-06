import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ImageInfo, ImageSource } from '../image-source.model';
import { explodeImage } from '../image-tools';

@Component({
  selector: 'tim-image-info-cards',
  templateUrl: './image-info-cards.component.html',
  styleUrls: ['./image-info-cards.component.scss']
})
export class ImageInfoCardsComponent implements OnInit, OnDestroy {

  @Input()
  public image: string;

  @Input()
  public source: ImageSource;

  public imageInfo: ImageInfo;
  public loading: boolean;
  public imageData: { registry: string; reference: string; tag: string; isDefaultTag: boolean; };

  protected readonly componetDestroyed = new Subject();

  public ngOnInit() {
    this.loading = true;
    this.imageData = explodeImage(this.image);
    this.source.loadImageInfo(this.image)
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(imageInfo => {
        this.loading = false;
        this.imageInfo = imageInfo;
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
