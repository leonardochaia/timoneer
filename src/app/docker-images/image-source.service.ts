import { Injectable, Inject } from '@angular/core';
import { ImageSourceMultiple, ImageSource } from './image-source.model';
import { of, combineLatest, BehaviorSubject } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { flatten } from '../shared/array-tools';
import { explodeImage } from './image-tools';
import { GenericImageSource } from './generic-image-source';
import { RegistryService } from '../registry/registry.service';
import { TimCacheService } from '../tim-cache/tim-cache.service';

@Injectable({
  providedIn: 'root'
})
export class ImageSourceService {

  public get sources() {
    return this.sourcesSubject.asObservable();
  }

  protected sourcesSubject = new BehaviorSubject<ImageSource[]>([]);

  constructor(
    @Inject(ImageSourceMultiple)
    sources: ImageSourceMultiple[],
    private readonly registry: RegistryService,
    private readonly cache: TimCacheService) {

    of(sources)
      .pipe(
        switchMap(s => combineLatest(s.map(so => so.loadImageSources()))),
        map(arr => flatten(arr)),
        map(arr => arr.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))),
      )
      .subscribe((srcs) => {
        this.sourcesSubject.next(srcs);
      });
  }

  public getForImage(image: string) {
    return this.sources
      .pipe(
        map(sources => sources.find(s => s.isImageOwner(image))),
        map(source => !source ? this.createGenericImageSourceForImage(image) : source),
        take(1),
      );
  }

  public getForDNS(registryDNS: string) {
    return this.sources.pipe(
      map(srcs => srcs.find(s => s.isRegistryOwner(registryDNS))),
      map(source => !source ? this.createGenericImageSource(registryDNS) : source),
      take(1),
    );
  }

  protected createGenericImageSourceForImage(image: string): ImageSource {
    const imageInfo = explodeImage(image);
    if (imageInfo.registry) {
      return this.createGenericImageSource(imageInfo.registry);
    }
  }

  protected createGenericImageSource(registryDNS: string): ImageSource {
    return new GenericImageSource(registryDNS, this.registry, this.cache);
  }
}
