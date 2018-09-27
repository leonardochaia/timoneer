import { Observable } from 'rxjs';
import { NgZone } from '@angular/core';

export function streamToObservable<T>(stream: NodeJS.EventEmitter, zone: NgZone) {
    return new Observable<T>(observer => {
        stream.on('data', (data) => {
            zone.run(() => {
                observer.next(data);
            });
        });

        stream.on('error', (data) => {
            zone.run(() => {
                observer.error(data);
            });
        });

        stream.on('end', () => {
            zone.run(() => {
                observer.complete();
            });
        });
        return {
            unsubscribe: () => (stream as any).destroy()
        };
    });
}
