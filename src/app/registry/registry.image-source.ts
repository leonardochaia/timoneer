import {
    ImageSource,
    ImageListFilter,
    ImageListItemData,
    ImageSourceAuthenticated,
    ImageInfo,
    ImageSourceCredentials
} from '../docker-images/image-source.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegistryService } from './registry.service';
import { DockerRegistrySettings } from '../settings/settings.model';
import { ImageLayerHistoryV1Compatibility } from './registry.model';

import { explodeImage } from '../docker-images/image-tools';
import { getRegistryDNSName } from './registry-tools';

export class RegistryImageSource
    extends ImageSource
    implements ImageSourceAuthenticated {

    public readonly credentials: ImageSourceCredentials;
    public readonly name: string;
    public readonly registryDNS: string;

    constructor(
        protected readonly registrySettings: DockerRegistrySettings,
        protected readonly registry: RegistryService) {
        super();
        this.credentials = {
            username: this.registrySettings.username,
            password: this.registrySettings.password,
        };
        this.name = this.registryDNS = getRegistryDNSName(registrySettings.url);
    }

    public loadList(filter?: ImageListFilter): Observable<ImageListItemData[]> {
        filter = filter || {};
        return this.registry.getRepositories(this.registrySettings)
            .pipe(
                map(r => r.map(image => ({
                    name: `${this.name}/${image}`,
                    displayName: image
                } as ImageListItemData))
                    .filter(item => !filter.term || item.name.includes(filter.term))),
            );
    }

    public loadImageInfo(image: string): Observable<ImageInfo> {
        return this.loadImageHistory(image)
            .pipe(
                map(manifest => manifest[0]),
                map(v1 => ({
                    Config: v1.config,
                    Architecture: v1.architecture,
                    Author: v1.author,
                    Created: v1.created,
                    DockerVersion: v1.docker_version,
                    Id: v1.id,
                    Os: v1.os
                } as ImageInfo))
            );
    }

    public loadImageHistory(image: string) {
        const imageData = this.explode(image);
        return this.registry.getImageManifest(this.registrySettings, imageData.reference, imageData.tag)
            .pipe(
                map(manifest => manifest.history.map(h => JSON.parse(h.v1Compatibility) as ImageLayerHistoryV1Compatibility))
            );
    }

    public loadImageTags(image: string) {
        const imageData = this.explode(image);
        return this.registry.getRepoTags(this.registrySettings, imageData.reference);
    }

    public getBasicAuth() {
        const auth = JSON.stringify({
            Username: this.credentials.username,
            Password: this.credentials.password
        });
        return btoa(auth);
    }

    /**
     * Allows to override image data to implementors
     * @param image
     */
    protected explode(image: string) {
        return explodeImage(image);
    }
}
