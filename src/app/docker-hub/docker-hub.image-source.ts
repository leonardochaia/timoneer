import {
    ImageListFilter, ImageListItemData
} from '../docker-images/image-source.model';
import { Observable, of, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { DockerHubService } from './docker-hub.service';
import { map, switchMap } from 'rxjs/operators';
import { DockerImageService } from '../daemon-tools/docker-image.service';
import { RegistryImageSource } from '../registry/registry.image-source';
import { explodeImage } from '../docker-images/image-tools';
import { DockerRegistrySettings } from '../settings/settings.model';
import { RegistryService } from '../registry/registry.service';
import { DOCKER_HUB_REGISTRY_DNS } from '../settings/settings.service';

@Injectable()
export class DockerHubImageSource extends RegistryImageSource {

    public priority = 1;

    public readonly name = 'Docker Hub';
    public readonly registryDNS = DOCKER_HUB_REGISTRY_DNS;

    constructor(
        registrySettings: DockerRegistrySettings,
        registry: RegistryService,
        private readonly dockerImages: DockerImageService,
        private readonly dockerHub: DockerHubService) {
        super(registrySettings, registry);
    }

    public loadList(filter?: ImageListFilter): Observable<ImageListItemData[]> {
        filter = filter || {};
        const publicImages = this.dockerImages.searchDockerHub(filter.term || 'library')
            .pipe(map(r => r.map(i => ({
                name: i.name
            } as ImageListItemData))));

        let privateRepos: Observable<ImageListItemData[]>;

        if (this.registrySettings.username && this.registrySettings.password) {
            privateRepos = this.dockerHub.getReposForUser(null)
                .pipe(
                    map(r => r.results
                        .map(i => ({
                            name: `${i.namespace}/${i.name}`
                        } as ImageListItemData))
                        .filter(item => !filter.term || item.name.includes(filter.term))
                    ),
                );
        } else {
            privateRepos = of([] as ImageListItemData[]);
        }

        return of(filter).pipe(
            switchMap(() => combineLatest([privateRepos, publicImages])),
            map(arr => [].concat.apply([], arr) as ImageListItemData[]),
        );
    }

    public isImageOwner(image: string) {
        const imageData = explodeImage(image);
        return !imageData.registry;
    }

    protected explode(image: string) {
        const imageData = explodeImage(image);
        if (!imageData.reference.includes('/')) {
            imageData.reference = `library/${imageData.reference}`;
        }
        return imageData;
    }
}
