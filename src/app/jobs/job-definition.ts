import { Subject, Observable } from 'rxjs';
import { JobProgress, JobError, IJobRunner } from './jobs.model';
import { Type, Provider } from '@angular/core';
import { JobInstance } from './job-instance';

export abstract class JobDefinition<TResult, TProgress extends JobProgress = JobProgress> {

    public abstract get title();

    public get completed() {
        return this.completionSubject.asObservable();
    }

    public get childJobAdded() {
        return this.childJobSubject.asObservable();
    }

    protected cancelled: Observable<void>;

    private completionSubject = new Subject<TResult>();
    private progressSubject: Subject<TProgress>;
    private childJobSubject = new Subject<JobInstance>();
    private jobRunner: IJobRunner;

    public startJob(
        cancelled: Observable<void>,
        progress: Subject<TProgress>,
        jobRunner: IJobRunner) {

        this.cancelled = cancelled;
        this.progressSubject = progress;
        this.jobRunner = jobRunner;
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
    }

    protected completeWithError(error: JobError) {
        this.throwIfCompleted();
        this.completionSubject.error(error);
        this.completionSubject.complete();
    }

    protected startChildJob<TChildResult, TChildProgress>(
        type: Type<JobDefinition<TChildResult, TChildProgress>>,
        ...additionalProviders: Provider[]) {

        const job = this.jobRunner.startJob(type, additionalProviders);

        this.childJobSubject.next(job);
        return job;
    }

    private throwIfCompleted() {
        if (this.completionSubject.closed) {
            throw new Error(`Failed to complete ${this.title} since it's already completed.`);
        }
    }
}
