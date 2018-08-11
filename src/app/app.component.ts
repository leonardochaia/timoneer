import { Component, Renderer2, OnDestroy } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppThemeService } from './shared/app-theme.service';
import { AppMenuService } from './app-menu/app-menu.service';

@Component({
  selector: 'tim-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  protected currentTheme: string;

  constructor(private overlayContainer: OverlayContainer,
    private renderer: Renderer2,
    menuService: AppMenuService,
    themeService: AppThemeService) {

    menuService.loadMenu();

    this.addBaseClasses();

    themeService.theme
      .subscribe(newTheme => {
        this.clearThemeClasses();

        this.currentTheme = newTheme;

        const classList = overlayContainer.getContainerElement().classList;
        classList.add(this.currentTheme);
        renderer.addClass(document.documentElement, this.currentTheme);
      });
  }

  public ngOnDestroy() {
    // This is done mostly for HMR.
    this.clearThemeClasses();
    this.clearBaseClasses();
  }

  private clearThemeClasses() {
    if (this.currentTheme) {
      const classList = this.overlayContainer.getContainerElement().classList;
      classList.remove(this.currentTheme);
      this.renderer.removeClass(document.documentElement, this.currentTheme);
    }
  }

  private addBaseClasses() {
    const classList = this.overlayContainer.getContainerElement().classList;
    const base = 'mat-typography';
    classList.add(base);
    this.renderer.addClass(document.documentElement, base);
    this.renderer.addClass(document.body, 'tim-body-bg');
  }

  private clearBaseClasses() {
    const classList = this.overlayContainer.getContainerElement().classList;
    const base = 'mat-typography';
    classList.remove(base);
    this.renderer.removeClass(document.documentElement, base);
    this.renderer.removeClass(document.body, 'tim-body-bg');
  }
}
