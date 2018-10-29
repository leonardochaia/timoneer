import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'tim-image-tags-selector-modal',
  templateUrl: './image-tags-selector-modal.component.html',
  styleUrls: ['./image-tags-selector-modal.component.scss']
})
export class ImageTagsSelectorModalComponent implements OnInit, OnDestroy {

  public readonly searchFormControl = new FormControl('');

  public tags: string[];

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
