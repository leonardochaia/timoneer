import { Component, OnInit, Input } from '@angular/core';
import { RegistryService } from '../registry.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { map } from '../../../../node_modules/rxjs/operators';

@Component({
  selector: 'tim-registry-list',
  templateUrl: './registry-list.component.html',
  styleUrls: ['./registry-list.component.scss']
})
export class RegistryListComponent implements OnInit {
  public repositories: string[];

  public error: string;

  public loading: boolean;

  @Input()
  public registryUrl: string;

  @Input()
  public amount: number;

  constructor(private registryService: RegistryService,
    private settingsService: SettingsService) { }

  public ngOnInit(): void {
    this.loading = true;
    this.registryService.getRepositories(this.registryUrl, this.amount)
      .subscribe(repositories => {
        this.repositories = repositories;
        this.loading = false;
      }, (e: HttpErrorResponse) => {
        this.loading = false;
        if (e.status <= 0) {
          this.error = 'Repository unavailable';
        } else {
          this.error = e.message;
        }
      });
  }

  public getImageName(repo: string) {
    return this.settingsService.getRegistrySettingsForUrl(this.registryUrl)
      .pipe(map(settings => this.settingsService.getRegistryName(settings) + repo));
  }

}
