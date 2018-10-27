import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ImageSourceService } from '../image-source.service';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { ImageInfo } from '../image-source.model';
import { explodeImage } from '../image-tools';

@Component({
  selector: 'tim-image-info-cards',
  templateUrl: './image-info-cards.component.html',
  styleUrls: ['./image-info-cards.component.scss']
})
export class ImageInfoCardsComponent implements OnInit, OnDestroy {

  @Input()
  public image: string;

  public imageInfo: ImageInfo;
  public loading: boolean;
  public imageData: { registry: string; reference: string; tag: string; isDefaultTag: boolean; };

  protected readonly componetDestroyed = new Subject();

  constructor(private readonly imageSource: ImageSourceService) { }

  public ngOnInit() {
    this.loading = true;
    this.imageData = explodeImage(this.image);
    this.imageSource.getForImage(this.image)
      .pipe(
        takeUntil(this.componetDestroyed),
        switchMap(source => source.loadImageInfo(this.image))
      )
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
