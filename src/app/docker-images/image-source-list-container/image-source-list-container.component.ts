import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageSource } from '../image-source.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tim-image-source-list-container',
  templateUrl: './image-source-list-container.component.html',
  styleUrls: ['./image-source-list-container.component.scss']
})
export class ImageSourceListContainerComponent implements OnInit, OnDestroy {

  public currentSource: ImageSource;

  public filterForm = this.fb.group({
    displayDanglingImages: [false],
    term: ['']
  });

  protected readonly componetDestroyed = new Subject();

  constructor(private readonly fb: FormBuilder) { }

  public ngOnInit() {
  }

  public sourceChanged(source: ImageSource) {
    this.currentSource = source;
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

}
