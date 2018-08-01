import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'tim-registry-cards',
  templateUrl: './registry-cards.component.html',
  styleUrls: ['./registry-cards.component.scss']
})
export class RegistryCardsComponent implements OnInit {

  public loading: boolean;

  public registries: { name: string, url: string }[];

  constructor(private settingsService: SettingsService) { }

  public ngOnInit() {

    this.loading = true;
    this.settingsService.getSettings()
      .subscribe(settings => {
        this.registries = settings.registries
          .filter(r => r.allowsCatalog)
          .map(r => ({
            name: this.settingsService.getRegistryName(r),
            url: r.url
          }));
        this.loading = false;
      });
  }
}
