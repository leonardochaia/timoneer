import { Subject, Observable } from 'rxjs';
import { JobProgress, JobError } from './jobs.model';

export abstract class JobDefinition<TResult> {

    public get completed() {
        return this.completionSubject.asObservable();
    }

    public abstract get title();

    protected completionSubject = new Subject<TResult>();
    protected progressSubject: Subject<JobProgress>;
    protected cancelled: Observable<void>;

    public startJob(cancellationToken: Observable<void>, progress: Subject<JobProgress>) {
        this.cancelled = cancellationToken;
        this.progressSubject = progress;
        this.start();
    }

    protected abstract start(): void;

    protected progress(progress: JobProgress) {
        if (progress) {
            this.progressSubject.next(progress);
        }
    }

    protected complete(result: TResult) {
        this.completionSubject.next(result);
        this.completionSubject.complete();
        this.completionSubject.unsubscribe();
        this.completeProgress();
    }

    protected completeWithError(error: JobError) {
        this.completionSubject.error(error);
        this.completionSubject.unsubscribe();
        this.completeProgress();
    }

    private completeProgress() {
        this.progressSubject.complete();
        this.progressSubject.unsubscribe();
    }
}
