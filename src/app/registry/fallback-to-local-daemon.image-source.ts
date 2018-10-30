import { ImageSource, ImageListFilter, ImageListItemData, ImageInfo } from '../docker-images/image-source.model';
import { RegistryImageSource } from './registry.image-source';
import { DockerDaemonImageSource } from '../daemon-tools/docker-daemon.image-source';
import { Observable, throwError } from 'rxjs';
import { ImageLayerHistoryV1Compatibility } from './registry.model';
import { catchError } from 'rxjs/operators';

/**
 * Wraps a RegistryImageSource to use the Daemon as fallback
 * for image actions
 */
export class FallbackToLocalDaemonSource extends ImageSource {
    public get name() {
        return this.wrapped.name;
    }

    public get registryDNS() {
        return this.wrapped.registryDNS;
    }

    constructor(
        protected readonly wrapped: RegistryImageSource,
        protected readonly daemon: DockerDaemonImageSource) {
        super();
        this.priority = wrapped.priority;
        this.hasAuthentication = wrapped.hasAuthentication;
        this.credentials = wrapped.credentials;
        this.supportsDeletions = wrapped.supportsDeletions;
    }

    public loadList(filter?: ImageListFilter): Observable<ImageListItemData[]> {
        return this.wrapped.loadList(filter);
    }

    public loadImageInfo(image: string): Observable<ImageInfo> {
        return this.wrap(this.wrapped.loadImageInfo(image), () => this.daemon.loadImageInfo(image));
    }

    public loadImageHistory(image: string): Observable<ImageLayerHistoryV1Compatibility[]> {
        return this.wrap(this.wrapped.loadImageHistory(image), () => this.daemon.loadImageHistory(image));
    }

    public loadImageTags(image: string): Observable<string[]> {
        return this.wrap(this.wrapped.loadImageTags(image), () => this.daemon.loadImageTags(image));
    }

    public isImageOwner(image: string) {
        return this.wrapped.isImageOwner(image);
    }

    public isRegistryOwner(reg: string) {
        return this.wrapped.isRegistryOwner(reg);
    }

    public getBasicAuth() {
        if (this.wrapped.getBasicAuth) {
            return this.wrapped.getBasicAuth();
        }
    }

    protected wrap<T>(original: Observable<T>, fallback: () => Observable<T>): Observable<T> {
        return original
            .pipe(
                catchError(wrappedError =>
                    fallback()
                        .pipe(catchError(daemonError => throwError(wrappedError))))
            );
    }
}
