import { Subject, Observable } from 'rxjs';
import { JobProgress, JobError, IJobRunner, JobLogLine } from './jobs.model';
import { Type, Provider } from '@angular/core';
import { JobInstance } from './job-instance';
import { take } from 'rxjs/operators';

export abstract class JobDefinition<TResult, TProgress extends JobProgress = JobProgress> {

    public abstract get title();

    public get completed() {
        return this.completionSubject.asObservable();
    }

    public get childJobAdded() {
        return this.childJobSubject.asObservable();
    }

    protected cancelled: Observable<void>;
    protected isCancelled = false;

    private completionSubject = new Subject<TResult>();
    private progressSubject: Subject<TProgress>;
    private logSubject: Subject<JobLogLine>;
    private childJobSubject = new Subject<JobInstance>();
    private jobRunner: IJobRunner;
    private finished = false;
    private currentPercent: number;

    public startJob(
        cancelled: Observable<void>,
        progress: Subject<TProgress>,
        logSubject: Subject<JobLogLine>,
        jobRunner: IJobRunner) {

        this.cancelled = cancelled;
        this.progressSubject = progress;
        this.jobRunner = jobRunner;
        this.logSubject = logSubject;

        this.cancelled
            .pipe(take(1))
            .subscribe(() => {
                this.isCancelled = true;
            });

        this.start();
    }

    protected abstract start(): void;

    protected progress(progress: TProgress) {
        if (progress) {
            if (!isNaN(progress.percent)) {
                this.currentPercent = progress.percent;
            } else {
                progress.percent = this.currentPercent;
            }
            progress.date = new Date(Date.now());
            this.progressSubject.next(progress);
        }
    }

    protected progressAndLog(progress: TProgress) {
        if (progress) {
            this.progress(progress);
            if (progress.message) {
                this.log(progress.message);
            }
        }
    }

    protected log(message: string) {
        const line: JobLogLine = {
            message: message,
            date: new Date()
        };
        this.logSubject.next(line);
    }

    protected complete(result: TResult) {
        this.throwIfCompleted();
        this.completionSubject.next(result);
        this.completionSubject.complete();
        this.finished = true;
    }

    protected completeWithError(error: JobError) {
        this.throwIfCompleted();
        this.completionSubject.error(error);
        this.completionSubject.complete();
        this.finished = true;
    }

    protected startChildJob<TChildResult, TChildProgress extends JobProgress>(
        type: Type<JobDefinition<TChildResult, TChildProgress>>,
        ...additionalProviders: Provider[]) {

        const job = this.jobRunner.startJob(type, additionalProviders);

        this.childJobSubject.next(job);

        this.logSubject.next({
            date: new Date(),
            message: `Starting Job: ${job.definition.title}`,
            childJob: job
        });

        return job;
    }

    private throwIfCompleted() {
        if (this.finished || this.isCancelled) {
            throw new Error(`Failed to complete ${this.title} since it's already finished.`);
        }
    }
}
