import { Observable, of } from 'rxjs';
import { Injectable, Inject } from '@angular/core';

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

    public abstract loadList(filter?: ImageListFilter): Observable<ImageListItemData[]>;
}

export interface ImageSourceDeletion {
    deleteImage?(image: ImageListItemData): Observable<void>;
}

export interface ImageSourceAuthenticated {
    username?: string;
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
