import { Observable } from 'rxjs';

export function streamToObservable<T>(stream: NodeJS.EventEmitter) {
    return new Observable<T>(observer => {
        stream.on('data', (data) => {
            this.zone.run(() => {
                observer.next(data);
            });
        });

        stream.on('error', (data) => {
            this.zone.run(() => {
                observer.error(data);
            });
        });

        stream.on('end', () => {
            this.zone.run(() => {
                observer.complete();
            });
        });
    });
}
