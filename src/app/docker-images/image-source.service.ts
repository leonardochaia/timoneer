import { Injectable, Inject } from '@angular/core';
import { ImageSourceMultiple, ImageSource } from './image-source.model';
import { of, combineLatest, BehaviorSubject } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { flatten } from '../shared/array-tools';

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
    sources: ImageSourceMultiple[]) {

    of(sources)
      .pipe(
        switchMap(s => combineLatest(s.map(so => so.loadImageSources()))),
        map(arr => flatten(arr)),
        map(arr => arr.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))),
        // take(1),
      )
      .subscribe((srcs) => {
        this.sourcesSubject.next(srcs);
      });
  }

  public getForImage(image: string) {
    return this.sources
      .pipe(
        map(sources => sources.find(s => s.isImageOwner(image))),
        take(1),
      );
  }

  public getForDNS(registryDNS: string) {
    return this.sources.pipe(
      map(srcs => srcs.find(s => s.isRegistryOwner(registryDNS))),
      take(1),
    );
  }

}
