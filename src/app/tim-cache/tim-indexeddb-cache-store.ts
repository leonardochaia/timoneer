import { Injectable } from '@angular/core';
import { TimCacheStoreService, CacheContent } from './tim-cache-store.service';
import { Observable, from } from 'rxjs';
import { set, get, del, Store, clear } from 'idb-keyval';
import { map } from 'rxjs/operators';

@Injectable()
export class TimIndexedDBCacheStore extends TimCacheStoreService {

    protected readonly store = new Store('tim-cache', 'keyval');

    public get(key: string): Observable<CacheContent> {
        return from(get<CacheContent>(key, this.store));
    }

    public set(key: string, contets: CacheContent): Observable<void> {
        return from(set(key, contets, this.store));
    }

    public has(key: string): Observable<boolean> {
        return this.get(key)
            .pipe(map(value => typeof value !== 'undefined'));
    }

    public evict(key: string): Observable<void> {
        return from(del(key, this.store));
    }

    public clear() {
        return from(clear(this.store));
    }
}
