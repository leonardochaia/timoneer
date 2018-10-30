import {
    ImageSource,
    ImageListFilter,
    ImageListItemData,
    ImageInfo
} from '../docker-images/image-source.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { DockerImageService } from './docker-image.service';
import { DockerEventsService } from './docker-events.service';
import { ImageLayerHistoryV1Compatibility } from '../registry/registry.model';
import { isValidImageName, explodeImage } from '../docker-images/image-tools';
import { flatten } from '../shared/array-tools';

@Injectable()
export class DockerDaemonImageSource
    extends ImageSource {

    public priority = 0;
    public readonly name = 'Docker Daemon';
    public readonly registryDNS = null;

    constructor(
        private readonly dockerEvents: DockerEventsService,
        private readonly dockerImage: DockerImageService) {
        super();
        this.supportsDeletions = true;
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
                map(all => all.map(h => ({
                    id: h.Id,
                    created: h.Created,
                    container_config: {
                        Cmd: [h.CreatedBy]
                    }
                } as ImageLayerHistoryV1Compatibility)))
            );
    }

    public loadImageTags(image: string) {
        return this.dockerImage.inspectImage(image)
            .pipe(
                map(i => i.RepoTags
                    .filter(r => isValidImageName(r))
                    .map(r => explodeImage(r).tag)
                )
            );
    }

    protected getImages(filter?: ImageListFilter) {
        let dockerFilter: any;
        filter = filter || {};
        if (filter.term) {
            dockerFilter = { reference: { [`*${filter.term}*`]: true } };
        }
        return this.dockerImage.imageList({
            all: filter ? filter.displayDanglingImages : false,
            filters: dockerFilter,
        }).pipe(
            map(r => flatten(
                r.map(i => i.RepoTags
                    .filter(t => filter.displayDanglingImages ? true : isValidImageName(t))
                    .map(t => ({
                        name: t,
                        id: i.Id,
                        size: i.Size
                    } as ImageListItemData)))))
        );
    }

}
