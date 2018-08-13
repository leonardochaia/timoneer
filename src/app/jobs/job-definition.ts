import { Subject, Observable } from 'rxjs';
import { JobProgress, JobError } from './jobs.model';

export abstract class JobDefinition<TResult, TProgress extends JobProgress = JobProgress> {

    public get completed() {
        return this.completionSubject.asObservable();
    }

    public abstract get title();

    protected cancelled: Observable<void>;

    private completionSubject = new Subject<TResult>();
    private progressSubject: Subject<TProgress>;

    public startJob(cancellationToken: Observable<void>, progress: Subject<TProgress>) {
        this.cancelled = cancellationToken;
        this.progressSubject = progress;
        this.start();
    }

    protected abstract start(): void;

    protected progress(progress: TProgress) {
        if (progress) {
            this.progressSubject.next(progress);
        }
    }

    protected complete(result: TResult) {
        this.throwIfCompleted();
        this.completionSubject.next(result);
        this.completionSubject.complete();
        this.completionSubject.unsubscribe();
        this.completeProgress();
    }

    protected completeWithError(error: JobError) {
        this.throwIfCompleted();
        this.completionSubject.error(error);
        this.completionSubject.unsubscribe();
        this.completeProgress();
    }

    private throwIfCompleted() {
        if (this.completionSubject.closed) {
            throw new Error(`Failed to complete ${this.title} since it's already completed.`);
        }
    }

    private completeProgress() {
        this.progressSubject.complete();
        this.progressSubject.unsubscribe();
    }
}
