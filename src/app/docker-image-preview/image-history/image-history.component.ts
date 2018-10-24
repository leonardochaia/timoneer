import { Component, OnInit, Input } from '@angular/core';
import { ImageManifest, ImageLayerHistoryV1Compatibility } from '../../registry/registry.model';

@Component({
  selector: 'tim-image-history',
  templateUrl: './image-history.component.html',
  styleUrls: ['./image-history.component.scss']
})
export class ImageHistoryComponent implements OnInit {

  @Input()
  public manifest: ImageManifest;

  public history: ImageLayerHistoryV1Compatibility[];

  constructor() { }

  public ngOnInit() {
    this.history = this.manifest.history.map(h => JSON.parse(h.v1Compatibility) as ImageLayerHistoryV1Compatibility);
  }

  public getCommand(cmd: string) {
    const nop = '#(nop)';
    const index = cmd.indexOf(nop);
    if (index >= 0) {
      return cmd.slice(index + nop.length);
    } else {
      return cmd;
    }
  }

}
