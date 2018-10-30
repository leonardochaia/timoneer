import { ImageSource, ImageListFilter, ImageListItemData, ImageInfo } from './image-source.model';
import { TimCacheService } from '../tim-cache/tim-cache.service';
import { Observable } from 'rxjs';
import { ImageLayerHistoryV1Compatibility } from '../registry/registry.model';

export class CachingImageSource extends ImageSource {
    public get name() {
        return this.wrapped.name;
    }

    public get registryDNS() {
        return this.wrapped.registryDNS;
    }

    constructor(
        protected readonly wrapped: ImageSource,
        protected readonly cache: TimCacheService,
        protected readonly cacheDurationInMinutes: number) {
        super();
        this.priority = wrapped.priority;
        this.hasAuthentication = wrapped.hasAuthentication;
        this.credentials = wrapped.credentials;
        this.supportsDeletions = wrapped.supportsDeletions;
    }

    public loadList(filter?: ImageListFilter): Observable<ImageListItemData[]> {
        return this.getFromCache(`imagesource/${this.registryDNS}/images/${JSON.stringify(filter)}`,
            () => this.wrapped.loadList(filter));
    }

    public loadImageInfo(image: string): Observable<ImageInfo> {
        return this.getFromCache(`imagesource/${this.registryDNS}/${image}/info`,
            () => this.wrapped.loadImageInfo(image));
    }

    public loadImageHistory(image: string): Observable<ImageLayerHistoryV1Compatibility[]> {
        return this.getFromCache(`imagesource/${this.registryDNS}/${image}/history`,
            () => this.wrapped.loadImageHistory(image));
    }

    public loadImageTags(image: string): Observable<string[]> {
        return this.getFromCache(`imagesource/${this.registryDNS}/${image}/tags`,
            () => this.wrapped.loadImageTags(image));
    }

    public isImageOwner(image: string) {
        return this.wrapped.isImageOwner(image);
    }

    public isRegistryOwner(reg: string) {
        return this.wrapped.isRegistryOwner(reg);
    }

    public deleteImage(image: string) {
        if (this.wrapped.deleteImage) {
            return this.wrapped.deleteImage(image);
        }
    }

    public getBasicAuth() {
        if (this.wrapped.getBasicAuth) {
            return this.wrapped.getBasicAuth();
        }
    }

    protected getFromCache<T>(key: string, fallback: () => Observable<T>): Observable<T> {
        if (typeof this.cacheDurationInMinutes === 'number' && this.cacheDurationInMinutes > 0) {
            return this.cache.get(key, fallback, this.cacheDurationInMinutes);
        } else {
            return fallback();
        }
    }
}
