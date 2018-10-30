import { Observable, MonoTypeOperatorFunction, of } from 'rxjs';
import { switchMap, ignoreElements, concat } from 'rxjs/operators';

export function asyncTap<T>(fn: (x: T) => Observable<any>): MonoTypeOperatorFunction<T> {
    return switchMap<T, T>(value => fn(value).pipe(ignoreElements(), concat(of(value))));
}
