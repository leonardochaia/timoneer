import { Component, OnInit, Input } from '@angular/core';
import { RegistryService } from '../registry.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SettingsService } from '../../settings/settings.service';
import { map } from 'rxjs/operators';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';
import { ImagePreviewContainerComponentData } from '../../docker-image-preview/image-preview-container/image-preview-container.component';
import { ContainerCreateBody } from 'dockerode';

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
        this.tabService.add(TimoneerTabs.DOCKER_CONTAINER_NEW, {
          params: {
            Image: image
          } as ContainerCreateBody
        });
      });
  }

  public imagePreview(repo: string) {
    this.tabService.add(TimoneerTabs.IMAGE_PREVIEW, {
      title: repo,
      params: {
        image: repo,
        registry: this.registryUrl,
        tag: 'latest'
      } as ImagePreviewContainerComponentData
    });
  }

}
