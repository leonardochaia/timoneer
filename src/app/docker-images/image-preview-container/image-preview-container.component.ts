import { Component, Inject } from '@angular/core';
import { TAB_DATA } from '../../tabs/tab.model';

export interface ImagePreviewContainerComponentData {
  image: string;
}

@Component({
  selector: 'tim-image-preview-container',
  templateUrl: './image-preview-container.component.html',
  styleUrls: ['./image-preview-container.component.scss']
})
export class ImagePreviewContainerComponent {

  public get image() {
    return this.tabData.image;
  }
  constructor(
    @Inject(TAB_DATA)
    private readonly tabData: ImagePreviewContainerComponentData) { }
}
