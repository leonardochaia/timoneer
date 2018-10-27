import { Component, Input, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { explodeImage } from '../image-tools';
import { ImageSourceService } from '../image-source.service';

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
export class ImageTagsSelectorComponent implements OnChanges, ControlValueAccessor {

  @Input()
  public repository: string;

  public allTags: string[];
  public truncatedTags: string[];

  public selectedTag: string;

  public loading = false;
  public disabled = false;
  public error: string;

  private onChanges: (image: string) => void;

  constructor(private readonly imageSource: ImageSourceService) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['repository'] && this.repository) {
      this.loading = true;
      const imageData = explodeImage(this.repository);

      // Use the provided tab as placeholder while we fetch the list
      this.tagsObtained([imageData.tag], imageData.tag);

      this.imageSource.getForImage(this.repository)
        .pipe(
          switchMap(source => source.loadImageTags(this.repository))
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

    const minLength = 5;

    if (this.allTags.length > minLength) {
      this.truncatedTags = this.allTags
        .sort(t => t.includes(this.selectedTag) ? 1 : 0)
        .slice(0, minLength);
    } else {
      this.truncatedTags = this.allTags.slice();
    }

    if (this.selectedTag && !this.truncatedTags.includes(this.selectedTag)) {
      this.truncatedTags.unshift(this.selectedTag);
    }
  }

  protected triggerOnChanges(tag: string) {
    if (this.onChanges) {
      this.onChanges(tag);
    }
  }
}
