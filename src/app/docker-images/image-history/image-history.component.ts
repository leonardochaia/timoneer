import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ImageLayerHistoryV1Compatibility } from '../../registry/registry.model';
import { Subject } from 'rxjs';
import { ImageSourceService } from '../image-source.service';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'tim-image-history',
  templateUrl: './image-history.component.html',
  styleUrls: ['./image-history.component.scss']
})
export class ImageHistoryComponent implements OnInit, OnDestroy {

  @Input()
  public image: string;

  public history: ImageLayerHistoryV1Compatibility[];
  public loading: boolean;

  protected readonly componetDestroyed = new Subject();

  constructor(private readonly imageSource: ImageSourceService) { }

  public ngOnInit() {
    this.loading = true;
    this.imageSource.getForImage(this.image)
      .pipe(
        takeUntil(this.componetDestroyed),
        switchMap(source => source.loadImageHistory(this.image))
      )
      .subscribe(history => {
        this.loading = false;
        this.history = history;
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  public getCommand(cmd: string) {
    const nop = '#(nop)';
    const index = cmd.indexOf(nop);
    if (index >= 0) {
      return cmd.slice(index + nop.length);
    } else {
      return cmd;
    }
  }

}
