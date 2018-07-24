import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundContainerComponent } from './not-found-container/not-found-container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NotFoundContainerComponent,
  ],
  exports: [
    NotFoundContainerComponent
  ]
})
export class ErrorManagementModule { }
