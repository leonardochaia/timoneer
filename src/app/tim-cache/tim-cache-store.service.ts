import { Observable } from 'rxjs';

export interface CacheContent {
    expiry: number;
    value: any;
}

export abstract class TimCacheStoreService {
    public abstract get(key: string): Observable<CacheContent>;
    public abstract set(key: string, contents: CacheContent): Observable<void>;
    public abstract has(key: string): Observable<boolean>;
    public abstract evict(key: string): Observable<void>;
    public abstract clear(): Observable<void>;
}
