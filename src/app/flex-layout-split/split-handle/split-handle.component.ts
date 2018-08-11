// Inspired on AngularFlexLayout Demos
// https://github.com/angular/flex-layout/tree/eda12c382c9ea2cc959ec27252b90c6f052a1fba/src/apps/demo-app/src/app/github-issues/split
import { Component, ElementRef, Inject, Output, HostBinding } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, fromEvent } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tim-split-handle',
  templateUrl: './split-handle.component.html',
  styleUrls: ['./split-handle.component.scss']
})
export class SplitHandleComponent {

  @Output()
  public drag: Observable<{ x: number, y: number }>;

  @HostBinding('style.cursor')
  private cursor: string;

  constructor(
    ref: ElementRef,
    @Inject(DOCUMENT) document: Document) {

    const getMouseEventPosition = (event: MouseEvent) => ({ x: event.movementX, y: event.movementY });

    const mousedown$ = fromEvent(ref.nativeElement, 'mousedown').pipe(map(getMouseEventPosition));
    const mousemove$ = fromEvent(document, 'mousemove').pipe(map(getMouseEventPosition));
    const mouseup$ = fromEvent(document, 'mouseup').pipe(map(getMouseEventPosition));

    this.drag = mousedown$.pipe(switchMap(() => mousemove$.pipe(takeUntil(mouseup$))));
  }

  public setDirection(direction: 'row' | 'column') {
    switch (direction) {
      case 'row':
        this.cursor = 'col-resize';
        break;
      case 'column':
        this.cursor = 'row-resize';
        break;
    }
  }

}
