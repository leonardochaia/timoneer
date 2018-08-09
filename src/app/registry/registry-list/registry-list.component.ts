import { Component, OnInit, Input } from '@angular/core';
import { RegistryService } from '../registry.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { map } from 'rxjs/operators';
import { TabService } from '../../navigation/tab.service';
import { ContainerCreateContainerComponent } from '../../daemon-tools/container-create-container/container-create-container.component';

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
    private settingsService: SettingsService,
    private tabService: TabService) { }

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

  public createContainer(repo: string) {
    this.getImageName(repo)
      .subscribe(image => {
        this.tabService.addTab({
          title: 'New Container',
          component: ContainerCreateContainerComponent,
          params: image
        });
      });
  }

}
