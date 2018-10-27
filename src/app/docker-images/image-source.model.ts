import { Observable, of } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { explodeImage } from './image-tools';
import { ImageLayerHistoryV1Compatibility } from '../registry/registry.model';

export interface ImageInfo {
    Id?: string;
    Architecture?: string;
    Config: ImageInfoContainerConfig;
    Created?: string;
    DockerVersion?: string;
    Os?: string;
    Author?: string;
}

export interface ImageInfoContainerConfig {
    User?: string;
    ExposedPorts?: { [key: string]: any };
    Env?: string[];
    Cmd?: string[];
    Volumes?: any;
    WorkingDir?: string;
    Entrypoint?: string[];
    Labels?: { [key: string]: string };
}

export interface ImageListItemData {
    displayName?: string;
    name: string;
    id?: string;
    size?: number;
}

export interface ImageListFilter {
    term?: string;
    displayDanglingImages?: boolean;
}

export abstract class ImageSource {
    public priority = 99;
    public abstract get name(): string;

    public abstract get registryDNS(): string;

    public abstract loadList(filter?: ImageListFilter): Observable<ImageListItemData[]>;

    public abstract loadImageInfo(image: string): Observable<ImageInfo>;

    public abstract loadImageHistory(image: string): Observable<ImageLayerHistoryV1Compatibility[]>;

    public abstract loadImageTags(image: string): Observable<string[]>;

    public isImageOwner(image: string) {
        if (!this.registryDNS) {
            return false;
        }

        const imageData = explodeImage(image);
        return imageData.registry
            && imageData.registry === this.registryDNS;
    }

    public isRegistryOwner(registryDNS: string) {
        return this.registryDNS === registryDNS;
    }
}

export interface ImageSourceDeletion {
    deleteImage?(image: string): Observable<void>;
}

export interface ImageSourceAuthenticated {
    credentials?: ImageSourceCredentials;
    getBasicAuth(): string;
}
export interface ImageSourceCredentials {
    username?: string;
    password?: string;
}

export abstract class ImageSourceMultiple {
    public abstract loadImageSources(): Observable<ImageSource[]>;
}

@Injectable()
export class GlobalImageSources extends ImageSourceMultiple {
    constructor(
        @Inject(ImageSource)
        protected readonly sources: ImageSource[]) {
        super();
    }

    public loadImageSources(): Observable<ImageSource[]> {
        return of(this.sources);
    }
}
