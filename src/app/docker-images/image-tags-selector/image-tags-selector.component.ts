import { Component, Input, OnChanges, SimpleChanges, forwardRef, OnDestroy } from '@angular/core';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { explodeImage } from '../image-tools';
import { ImageSourceService } from '../image-source.service';
import { MatDialog } from '@angular/material';
import { ImageTagsSelectorModalComponent } from '../image-tags-selector-modal/image-tags-selector-modal.component';
import { Subject } from 'rxjs';

export const DEFAULT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImageTagsSelectorComponent),
  multi: true
};

@Component({
  selector: 'tim-image-tags-selector',
  templateUrl: './image-tags-selector.component.html',
  styleUrls: ['./image-tags-selector.component.scss'],
  providers: [DEFAULT_VALUE_ACCESSOR]
})
export class ImageTagsSelectorComponent
  implements OnDestroy, OnChanges, ControlValueAccessor {

  @Input()
  public repository: string;

  public allTags: string[];
  public truncatedTags: string[];

  public selectedTag: string;

  public loading = false;
  public disabled = false;
  public error: string;

  private onChanges: (image: string) => void;
  private componentDestroyed = new Subject<void>();

  constructor(
    private readonly imageSource: ImageSourceService,
    private readonly matDialog: MatDialog) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['repository'] && this.repository) {
      this.loading = true;
      const imageData = explodeImage(this.repository);

      // Use the provided tab as placeholder while we fetch the list
      this.tagsObtained([imageData.tag], imageData.tag);

      this.imageSource.getForImage(this.repository)
        .pipe(
          switchMap(source => source.loadImageTags(this.repository)),
          takeUntil(this.componentDestroyed),
        )
        .subscribe(tags => {
          this.error = null;
          this.loading = false;
          this.tagsObtained(tags, imageData.tag);
        }, e => {
          this.error = e.message;
          this.loading = false;
          console.error(e);
        });
    }
  }

  public tagSelected(tag: string) {
    this.selectedTag = tag;
    this.triggerOnChanges(this.selectedTag);
  }

  public writeValue(tag: string): void {
    this.selectedTag = tag;
  }

  public registerOnChange(fn: (image: string) => void): void {
    this.onChanges = fn;
  }

  public registerOnTouched(fn: () => void): void {
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public viewAllTabs() {
    this.matDialog.open(ImageTagsSelectorModalComponent, {
      data: {
        tags: this.allTags
      }
    })
      .afterClosed()
      .pipe(take(1))
      .subscribe(tag => {
        if (tag && tag.length) {
          this.tagSelected(tag);
          this.updateTruncatedTags();
        }
      });
  }

  public ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

  protected tagsObtained(tags: string[], desiredTag?: string) {
    this.allTags = tags;
    // Determine a tag
    if (!desiredTag || desiredTag === 'latest') {
      if (this.allTags.includes('latest')) {
        desiredTag = 'latest';
      } else {
        desiredTag = this.allTags[0];
      }
    }

    this.tagSelected(desiredTag);
    this.updateTruncatedTags();
  }

  protected updateTruncatedTags() {
    const tagIndex = this.allTags.indexOf(this.selectedTag);
    const start = tagIndex >= 2 ? 2 : tagIndex;
    const end = tagIndex + 3 < this.allTags.length ? 3 : this.allTags.length - tagIndex;

    this.truncatedTags = this.allTags
      .slice(tagIndex - start, tagIndex + end)
      .sort()
      .sort(t => t === 'latest' ? 0 : t === this.selectedTag ? 1 : 99);

    if (!this.truncatedTags.includes('latest') && this.allTags.includes('latest')) {
      this.truncatedTags.unshift('latest');
    }
  }

  protected triggerOnChanges(tag: string) {
    if (this.onChanges) {
      this.onChanges(tag);
    }
  }
}
