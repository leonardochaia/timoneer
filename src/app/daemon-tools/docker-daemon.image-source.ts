import { ImageSource, ImageListFilter, ImageListItemData, ImageSourceDeletion, ImageInfo } from '../docker-images/image-source.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { DockerImageService } from './docker-image.service';
import { DockerEventsService } from './docker-events.service';

@Injectable()
export class DockerDaemonImageSource
    extends ImageSource
    implements ImageSourceDeletion {

    public priority = 0;
    public readonly name = 'Docker Daemon';
    public readonly registryDNS = null;

    constructor(
        private readonly dockerEvents: DockerEventsService,
        private readonly dockerImage: DockerImageService) {
        super();
    }

    public loadList(filter?: ImageListFilter): Observable<ImageListItemData[]> {
        return this.dockerEvents.bindAll(['delete', 'import', 'load', 'pull', 'tag', 'untag'], 'image')
            .pipe(
                switchMap(() => this.getImages(filter))
            );
    }

    public loadImageInfo(image: string): Observable<ImageInfo> {
        return this.dockerImage.inspectImage(image)
            .pipe(
                map(i => i)
            );
    }

    public deleteImage(image: string): Observable<void> {
        return this.dockerImage.removeImage(image);
    }

    public loadImageHistory(image: string) {
        return this.dockerImage.getHistory(image)
            .pipe(
                tap(h => console.log(h))
            );
    }

    public loadImageTags(image: string) {
        return this.dockerImage.inspectImage(image)
            .pipe(
                map(i => i.RepoTags)
            );
    }

    protected getImages(filter?: ImageListFilter) {
        let dockerFilter: any;
        if (filter && filter.term) {
            dockerFilter = { reference: { [`*${filter.term}*`]: true } };
        }
        return this.dockerImage.imageList({
            all: filter ? filter.displayDanglingImages : false,
            filters: dockerFilter,
        }).pipe(
            map(r => r.map(i => ({
                name: i.RepoTags ? i.RepoTags.join(', ') : i.Id,
                id: i.Id,
                size: i.Size
            } as ImageListItemData)))
        );
    }

}
