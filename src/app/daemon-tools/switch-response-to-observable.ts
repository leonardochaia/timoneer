import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function switchResponseToObservable<T>(transformer: (decoded: string) => T = null) {
    return (source: Observable<Response>) =>
        source.pipe(switchMap(response =>
            new Observable<T>(observer => {
                const reader = response.body.getReader();
                const decoder = new window['TextDecoder']('utf-8');

                const processText = (done: boolean, value: any) => {
                    // Result objects contain two properties:
                    // done  - true if the stream has already given you all tim data.
                    // value - some data. Always undefined when done is true.
                    if (done) {
                        observer.complete();
                        return;
                    }

                    const decoded = decoder
                        .decode(value);
                    if (transformer) {
                        observer.next(transformer(decoded));
                    } else {
                        observer.next(decoded);
                    }

                    // Read some more, and call this function again
                    return reader.read().then((r) => processText(r.done, r.value));
                };

                reader.read().then((r) => processText(r.done, r.value));

                return {
                    unsubscribe: () => reader.cancel
                };
            })
        ));
}
