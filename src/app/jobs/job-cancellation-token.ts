import { Subject } from 'rxjs';

export class JobCancellationToken extends Subject<void> {

    public cancel() {
        if (!this.closed) {
            this.next();
            this.complete();
            this.unsubscribe();
        } else {
            console.warn('Attempted to cancel an already cancelled token');
        }
    }
}
