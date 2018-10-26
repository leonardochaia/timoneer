import { Component, OnInit, Input } from '@angular/core';
import { ImageManifest, ImageLayerHistoryV1Compatibility, ImageHistoryContainerConfig } from '../../registry/registry.model';

@Component({
  selector: 'tim-manifest-metadata',
  templateUrl: './manifest-metadata.component.html',
  styleUrls: ['./manifest-metadata.component.scss']
})
export class ManifestMetadataComponent implements OnInit {

  @Input()
  public manifest: ImageManifest;
  public history: ImageLayerHistoryV1Compatibility[];
  public baseConfig: ImageHistoryContainerConfig;

  constructor() { }

  public ngOnInit() {
    this.history = this.manifest.history.map(h => JSON.parse(h.v1Compatibility) as ImageLayerHistoryV1Compatibility);
    this.baseConfig = this.history[0].container_config;
  }

}
