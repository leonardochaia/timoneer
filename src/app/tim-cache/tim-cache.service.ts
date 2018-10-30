import { Injectable } from '@angular/core';
import { Subject, Observable, of, throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { TimCacheStoreService, CacheContent } from './tim-cache-store.service';
import { asyncTap } from '../shared/rxjs.operator';

@Injectable()
export class TimCacheService {
  private inFlightObservables: Map<string, Subject<any>> = new Map<string, Subject<any>>();

  constructor(protected readonly cache: TimCacheStoreService) { }

  /**
   * Gets the value from cache if the key is provided.
   * If no value exists in cache, then check if the same call exists
   * in flight, if so return the subject. If not create a new
   * Subject inFlightObservable and return the source observable.
   */
  public get<T>(key: string, fallback?: () => Observable<T>, maxAge?: number): Observable<T> {
    return this.getValueFromCacheIfValid(key)
      .pipe(
        switchMap(contents => {
          if (contents) {
            console.log(`%cGetting from cache ${key}`, 'color: green');
            return this.cache.get(key).pipe(map(c => c.value));
          } else {

            if (this.inFlightObservables.has(key)) {
              return this.inFlightObservables.get(key).asObservable();
            } else {
              if (fallback) {
                this.inFlightObservables.set(key, new Subject());
                console.log(`%c Executing Fallback for ${key}`, 'color: purple');
                return fallback().pipe(asyncTap((value) => this.set(key, value, maxAge)));
              } else {
                return throwError('Invalid fallback provided');
              }
            }
          }
        })
      );
  }

  /**
   * Sets the value with key in the cache
   * Notifies all observers of the new value
   */
  public set(key: string, value: any, durationInMinutes?: number) {
    this.notifyInFlightObservers(key, value);
    return this.cache.set(key, this.createCacheContents(value, durationInMinutes));
  }

  public clear() {
    return this.cache.clear();
  }

  /**
   * Publishes the value to all observers of the given
   * in progress observables if observers exist.
   */
  protected notifyInFlightObservers(key: string, value: any): void {
    if (this.inFlightObservables.has(key)) {
      const inFlight = this.inFlightObservables.get(key);
      const observersCount = inFlight.observers.length;
      if (observersCount) {
        console.log(`%cNotifying ${inFlight.observers.length} flight subscribers for ${key}`, 'color: blue');
        inFlight.next(value);
      }
      inFlight.complete();
      this.inFlightObservables.delete(key);
    }
  }

  /**
   * Checks if the key exists and   has not expired.
   */
  protected getValueFromCacheIfValid(key: string): Observable<CacheContent> {
    return this.cache.has(key)
      .pipe(
        switchMap(hasKey => hasKey ? this.cache.get(key) : of(null as CacheContent)),
        switchMap(contents => contents && this.isExpired(contents) ?
          this.cache.evict(key).pipe(map(() => null)) : of(contents)),
      );
  }

  protected isExpired(contents: CacheContent) {
    return contents.expiry <= Date.now();
  }

  protected createCacheContents(value: any, durationInMinutes: number) {
    if (typeof durationInMinutes !== 'number') {
      throw new Error('A duration for the cache entry must be provided and it must be a number');
    }

    const expiration = new Date(Date.now());
    return {
      value: value,
      expiry: expiration.setMinutes(expiration.getMinutes() + durationInMinutes)
    } as CacheContent;
  }
}
