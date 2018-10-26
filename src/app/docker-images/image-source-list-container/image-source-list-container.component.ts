import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ImageSource } from '../image-source.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TAB_DATA } from '../../tabs/tab.model';

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

  public get initialSource() {
    return this.tabData.name;
  }

  protected readonly componetDestroyed = new Subject();

  constructor(
    private readonly fb: FormBuilder,
    @Inject(TAB_DATA)
    private tabData: { name: string }) { }

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
