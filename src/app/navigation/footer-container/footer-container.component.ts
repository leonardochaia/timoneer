import { Component } from '@angular/core';
import { UpdaterService } from '../../electron-tools/updater.service';

@Component({
  selector: 'tim-footer-container',
  templateUrl: './footer-container.component.html',
  styleUrls: ['./footer-container.component.scss']
})
export class FooterContainerComponent {

  public get appVersion() {
    return this.updater.currentVersion;
  }

  constructor(private updater: UpdaterService) { }
}
