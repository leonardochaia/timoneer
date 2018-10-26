import { ImageSource, ImageListFilter, ImageListItemData } from '../docker-images/image-source.model';
import { Observable, throwError, of, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { DockerHubService } from './docker-hub.service';
import { map, switchMap } from 'rxjs/operators';
import { SettingsService } from '../settings/settings.service';
import { DockerImageService } from '../daemon-tools/docker-image.service';

@Injectable()
export class DockerHubImageSource extends ImageSource {
    public priority = 1;
    public readonly name = 'Docker Hub';

    constructor(
        private readonly settings: SettingsService,
        private readonly dockerImages: DockerImageService,
        private readonly dockerHub: DockerHubService) {
        super();
    }

    public loadList(filter?: ImageListFilter): Observable<ImageListItemData[]> {
        filter = filter || {};
        const hubImages = this.dockerImages.searchDockerHub(filter.term || 'library')
            .pipe(map(r => r.map(i => ({
                name: i.name
            } as ImageListItemData))));

        const privateRepos = this.settings.getDockerIOSettings()
            .pipe(
                switchMap(settings => {
                    if (settings && settings.username && settings.password) {
                        return this.dockerHub.getReposForUser(null)
                            .pipe(
                                map(r => r.results
                                    .map(i => ({
                                        name: `${i.namespace}/${i.name}`
                                    } as ImageListItemData))
                                    .filter(item => !filter.term || item.name.includes(filter.term))
                                ),
                            );
                    } else {
                        return of([] as ImageListItemData[]);
                        // return throwError('Docker Hub is not configured');
                    }
                }),
            );
        return of(filter).pipe(
            switchMap(f => combineLatest([hubImages, privateRepos])),
            map(arr => [].concat.apply([], arr) as ImageListItemData[]),
        );
    }
}
