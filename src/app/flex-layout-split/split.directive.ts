// Inspired on AngularFlexLayout Demos
// https://github.com/angular/flex-layout/tree/eda12c382c9ea2cc959ec27252b90c6f052a1fba/src/apps/demo-app/src/app/github-issues/split
import {
  Directive, ContentChildren,
  QueryList, OnDestroy,
  ElementRef, ComponentFactoryResolver,
  AfterViewInit, ChangeDetectorRef, Self, Optional
} from '@angular/core';
import { SplitAreaDirective } from './split-area.directive';
import { SplitHandleComponent } from './split-handle/split-handle.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutDirective } from '@angular/flex-layout';

@Directive({
  selector: '[timSplit]'
})
export class SplitDirective implements AfterViewInit, OnDestroy {

  public get direction() {
    return this.fxLayout.activatedValue;
  }

  @ContentChildren(SplitAreaDirective)
  private areas: QueryList<SplitAreaDirective>;

  private componetDestroyed = new Subject();

  constructor(private elementRef: ElementRef,
    private cd: ChangeDetectorRef,
    @Optional() @Self()
    public fxLayout: LayoutDirective,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  public ngAfterViewInit() {
    this.areas.forEach((area, i) => {
      if (i !== this.areas.length - 1) {
        const handle = this.createHandle(area);
        handle.drag
          .pipe(takeUntil(this.componetDestroyed))
          .subscribe(pos => this.onDrag(pos));
      }
      this.cd.detectChanges();
    });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  /**
   * While dragging, continually update the `flex.activatedValue` for each area
   * managed by the splitter.
   */
  public onDrag({ x, y }: { x: number, y: number }): void {
    const dragAmount = (this.direction === 'row') ? x : y;

    this.areas.forEach((area, i) => {
      // get the cur flex and the % in px
      const flex = area.flex;
      const delta = (i === 0) ? dragAmount : -dragAmount;
      const currentValue = flex.activatedValue;

      // Update Flex-Layout value to build/inject new flexbox CSS
      flex.activatedValue = this.calculateSize(currentValue, delta);
    });
  }

  /**
   * Use the pixel delta change to recalculate the area size (%)
   * Note: flex value may be '', %, px, or '<grow> <shrink> <basis>'
   */
  public calculateSize(value: string | number, delta: number) {
    const containerSizePx = this.elementRef.nativeElement.clientWidth;
    const elementSizePx = Math.round(this.valueToPixel(value, containerSizePx));

    const elementSize = ((elementSizePx + delta) / containerSizePx) * 100;
    return Math.round(elementSize * 100) / 100;
  }

  /**
   * Convert the pixel or percentage value to a raw
   * pixel float value.
   */
  public valueToPixel(value: string | number, parentWidth: number): number {
    const isPercent = () => String(value).indexOf('px') < 0;
    let size = parseFloat(String(value));
    if (isPercent()) {
      size = parentWidth * (size / 100);  // Convert percentage to actual pixel float value
    }
    return size;
  }

  public createHandle(area: SplitAreaDirective) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SplitHandleComponent);
    const componentRef = area.viewContainerRef.createComponent(componentFactory);
    const handle = componentRef.instance;
    handle.setDirection(this.direction as any);
    return handle;
  }

}
