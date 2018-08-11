// Inspired on AngularFlexLayout Demos
// https://github.com/angular/flex-layout/tree/eda12c382c9ea2cc959ec27252b90c6f052a1fba/src/apps/demo-app/src/app/github-issues/split
import { Directive, Self, HostBinding, ElementRef, ViewContainerRef, Optional } from '@angular/core';
import { FlexDirective } from '@angular/flex-layout';

@Directive({
  selector: '[timSplitArea]',
})
export class SplitAreaDirective {

  @HostBinding('style.overflow')
  public overflow = 'auto';

  constructor(
    public viewContainerRef: ViewContainerRef,
    public elementRef: ElementRef,
    @Optional() @Self()
    public flex: FlexDirective) { }
}
