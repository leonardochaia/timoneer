import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitAreaDirective } from './split-area.directive';
import { SplitDirective } from './split.directive';
import { SplitHandleComponent } from './split-handle/split-handle.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
  declarations: [
    SplitAreaDirective,
    SplitDirective,
    SplitHandleComponent
  ],
  exports: [
    SplitAreaDirective,
    SplitDirective,
    SplitHandleComponent,
  ],
  entryComponents: [
    SplitHandleComponent,
  ]
})
export class FlexLayoutSplitModule { }
