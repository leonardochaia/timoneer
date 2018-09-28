import { Component, OnInit } from '@angular/core';
import { DockerHubService } from '../docker-hub.service';
import { TabService } from '../../tabs/tab.service';
import { TimoneerTabs } from '../../timoneer-tabs';

@Component({
  selector: 'tim-docker-hub-repo-list',
  templateUrl: './docker-hub-repo-list.component.html',
  styleUrls: ['./docker-hub-repo-list.component.scss']
})
export class DockerHubRepoListComponent implements OnInit {
  public repos: { namespace: string; name: string; }[];
  public error: string;

  public loading: boolean;

  constructor(
    private dockerHub: DockerHubService,
    private tabService: TabService) { }

  public ngOnInit() {
    this.loading = true;
    this.dockerHub.getReposForUser()
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

}
