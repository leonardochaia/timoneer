import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ImageSourceService } from '../image-source.service';
import { ImageSource } from '../image-source.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { ImageListComponent } from '../image-list/image-list.component';

@Component({
  selector: 'tim-image-source-list',
  templateUrl: './image-source-list.component.html',
  styleUrls: ['./image-source-list.component.scss']
})
export class ImageSourceListComponent implements OnInit, OnDestroy {

  @Input()
  public initialSource: string;

  @Input()
  public filterForm: FormGroup;

  @Output()
  public sourceChanged = new EventEmitter<ImageSource>();

  public sources: ImageSource[];

  public initialIndex: number;

  protected readonly componetDestroyed = new Subject();

  constructor(private readonly imageSource: ImageSourceService) { }

  public ngOnInit() {
    return this.imageSource.sources
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(sources => {
        this.sources = sources;
        if (this.initialSource) {
          this.initialIndex = this.sources.findIndex(s => s.name === this.initialSource);
        } else {
          this.initialIndex = 0;
        }
      });
  }

  public getSourceLabel(source: ImageSource, imageList: ImageListComponent) {
    if (!imageList || imageList.loading) {
      return `${source.name} (..)`;
    } else if (imageList.error || !imageList.images) {
      return `${source.name} (errored)`;
    } else {
      return `${source.name} (${imageList.images.length})`;
    }
  }

  public onTabChanged(event: MatTabChangeEvent) {
    this.sourceChanged.emit(this.sources[event.index]);
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
