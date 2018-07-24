import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'tim-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public themeClass = 'indigo-theme';

  constructor(overlayContainer: OverlayContainer) {
    const classList = overlayContainer.getContainerElement().classList;
    classList.add(this.themeClass);
    classList.add('mat-typography');
  }
}
