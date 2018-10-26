import { Injectable, Inject } from '@angular/core';
import { ImageSourceMultiple, ImageSource } from './image-source.model';
import { of, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageSourceService {

  constructor(
    @Inject(ImageSourceMultiple)
    protected readonly sources: ImageSourceMultiple[]) { }

  public loadSources() {
    return of(this.sources)
      .pipe(
        switchMap(s => combineLatest(s.map(so => so.loadImageSources()))),
        map(arr => [].concat.apply([], arr) as ImageSource[]),
        map(arr => arr.sort(i => i.priority)),
      );
  }
}
