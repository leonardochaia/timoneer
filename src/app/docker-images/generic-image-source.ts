import { ImageSource, ImageListFilter, ImageListItemData, ImageInfo } from './image-source.model';
import { TimCacheService } from '../tim-cache/tim-cache.service';
import { Observable } from 'rxjs';
import { ImageLayerHistoryV1Compatibility } from '../registry/registry.model';
import { RegistryService } from '../registry/registry.service';
import { RegistryImageSource } from '../registry/registry.image-source';
import { DEFAULT_REGISTRY_CACHE } from '../settings/settings.service';
import { CachingImageSource } from './caching-image-source';
import { DockerRegistrySettings } from '../settings/settings.model';

export class GenericImageSource extends ImageSource {
    public readonly name = 'Generic Image Source';
    private readonly wrapped: ImageSource;

    constructor(
        public readonly registryDNS: string,
        private readonly registry: RegistryService,
        private readonly cache: TimCacheService) {
        super();
        const registrySettings = {
            enableCaching: true,
            cacheDurationInMinutes: DEFAULT_REGISTRY_CACHE,
            isDockerHub: false,
            url: `https://${registryDNS}/`,
            username: null,
            password: null
        } as DockerRegistrySettings;

        const registrySource = new RegistryImageSource(registrySettings, this.registry);

        this.wrapped = new CachingImageSource(registrySource, this.cache, registrySettings.cacheDurationInMinutes);
    }

    public loadList(filter?: ImageListFilter): Observable<ImageListItemData[]> {
        return this.wrapped.loadList(filter);
    }

    public loadImageInfo(image: string): Observable<ImageInfo> {
        return this.wrapped.loadImageInfo(image);
    }

    public loadImageHistory(image: string): Observable<ImageLayerHistoryV1Compatibility[]> {
        return this.wrapped.loadImageHistory(image);
    }

    public loadImageTags(image: string): Observable<string[]> {
        return this.wrapped.loadImageTags(image);
    }
}
