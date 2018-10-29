import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'tim-image-tags-selector-modal',
  templateUrl: './image-tags-selector-modal.component.html',
  styleUrls: ['./image-tags-selector-modal.component.scss']
})
export class ImageTagsSelectorModalComponent implements OnInit, OnDestroy {

  public readonly searchFormControl = new FormControl('');

  public tags: string[];

  @ViewChild(CdkVirtualScrollViewport)
  private scrollViewport: CdkVirtualScrollViewport;

  private componentDestroyed = new Subject<void>();

  constructor(
    private instance: MatDialogRef<ImageTagsSelectorModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: { tags: string[] }) {
    this.tags = this.data.tags.slice();
  }

  public ngOnInit() {

    this.searchFormControl
      .valueChanges
      .pipe(
        takeUntil(this.componentDestroyed),
        debounceTime(250)
      )
      .subscribe(term => {
        this.tags = this.data.tags.filter(t => t.includes(term));
        this.scrollViewport.scrollToIndex(0);
      });
  }

  public tagSelected(tag: string) {
    this.instance.close(tag);
  }

  public ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }
}
