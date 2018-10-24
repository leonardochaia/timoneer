import { Component, OnInit, Inject } from '@angular/core';
import { RegistryService } from '../../registry/registry.service';
import { TAB_DATA } from '../../tabs/tab.model';
import { ImageManifest } from '../../registry/registry.model';

export interface ImagePreviewContainerComponentData {
  image: string;
  tag: string;
  registry: string;
}

@Component({
  selector: 'tim-image-preview-container',
  templateUrl: './image-preview-container.component.html',
  styleUrls: ['./image-preview-container.component.scss']
})
export class ImagePreviewContainerComponent implements OnInit {
  public manifest: ImageManifest;

  constructor(
    @Inject(TAB_DATA)
    private tabData: ImagePreviewContainerComponentData,
    private registry: RegistryService) { }

  public ngOnInit() {
    this.registry.getImageManifest(this.tabData.registry, this.tabData.image, this.tabData.tag)
      .subscribe(manifest => {
        this.manifest = manifest;
      });
  }
}
