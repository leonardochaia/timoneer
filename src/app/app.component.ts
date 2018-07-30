import { Component, Renderer2 } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppThemeService } from './shared/app-theme.service';

@Component({
  selector: 'tim-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  protected currentTheme: string;

  constructor(private overlayContainer: OverlayContainer,
    private renderer: Renderer2,
    themeService: AppThemeService) {

    this.addBaseClasses();

    themeService.theme
      .subscribe(newTheme => {
        const classList = overlayContainer.getContainerElement().classList;
        if (this.currentTheme) {
          classList.remove(this.currentTheme);
          renderer.removeClass(document.documentElement, this.currentTheme);
        }

        this.currentTheme = newTheme;

        classList.add(this.currentTheme);
        renderer.addClass(document.documentElement, this.currentTheme);
      });
  }

  private addBaseClasses() {
    const classList = this.overlayContainer.getContainerElement().classList;
    const base = 'mat-typography';
    classList.add(base);
    this.renderer.addClass(document.documentElement, base);
    this.renderer.addClass(document.body, 'mat-body-bg');
  }
}
