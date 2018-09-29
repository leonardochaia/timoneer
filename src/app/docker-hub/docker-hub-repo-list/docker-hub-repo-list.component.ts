import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DockerHubService } from '../docker-hub.service';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';
import { DockerHubRepositoryResponse } from '../docker-hub.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tim-docker-hub-repo-list',
  templateUrl: './docker-hub-repo-list.component.html',
  styleUrls: ['./docker-hub-repo-list.component.scss']
})
export class DockerHubRepoListComponent implements OnInit, OnDestroy {
  public repos: DockerHubRepositoryResponse;
  public error: string;

  public loading: boolean;

  @Input()
  // TODO: Pagination
  public amount = 500;

  private componetDestroyed = new Subject();

  constructor(
    private dockerHub: DockerHubService,
    private tabService: TabService) { }

  public ngOnInit() {
    this.loading = true;
    this.dockerHub.getReposForUser(null, this.amount)
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(repos => {
        this.repos = repos;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.error = error.message;
      });
  }

  public createContainer(repo: { namespace: string; name: string; }) {
    this.tabService.add(TimoneerTabs.DOCKER_CONTAINER_NEW, {
      params: `${repo.namespace}/${repo.name}`
    });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
