import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockerHubRepoListComponent } from './docker-hub-repo-list/docker-hub-repo-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule, MatIconModule, MatButtonModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DockerHubRepoListContainerComponent } from './docker-hub-repo-list-container/docker-hub-repo-list-container.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,

    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,

    SharedModule,

  ],
  declarations: [
    DockerHubRepoListComponent,
    DockerHubRepoListContainerComponent
  ],
  exports: [
    DockerHubRepoListComponent
  ]
})
export class DockerHubModule { }
