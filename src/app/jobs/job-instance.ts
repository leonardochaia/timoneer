import { BehaviorSubject, Subject } from 'rxjs';
import { JobStatus, JobProgress, JobError, IJobRunner, JobLogLine } from './jobs.model';
import { JobCancellationToken } from './job-cancellation-token';
import { take } from 'rxjs/operators';
import { JobExecutionConfiguration } from './job-execution-configuration';
import { JobDefinition } from './job-definition';
import { Type, Provider } from '@angular/core';
import { v1 as uuid } from 'uuid';

export class JobInstance<TJobDef
    extends JobDefinition<TResult, TProgress> = JobDefinition<any, TProgress>,
    TResult = any,
    TProgress extends JobProgress = JobProgress> {

    public readonly id = uuid();

    public get status() {
        return this.statusSubject.value;
    }

    public get completed() {
        return this.definition.completed;
    }

    public get cancelled() {
        return this.cancellationToken.asObservable();
    }

    public get statusChange() {
        return this.statusSubject.asObservable();
    }

    public get progress() {
        return this.progressSubject.asObservable();
    }

    public get currentProgress() {
        return this.progressSubject.value;
    }

    public get configuration() {
        return this.executionConfiguration.configuration;
    }

    public get result() {
        return this.currentResult;
    }

    public get error() {
        return this.errorSubject.value;
    }

    public get children() {
        return this.childJobs;
    }

    public readonly logs: JobLogLine[] = [];

    protected currentResult: TResult;

    protected statusSubject = new BehaviorSubject<JobStatus>(JobStatus.Queued);
    protected progressSubject = new BehaviorSubject<TProgress>(<TProgress>{});
    protected logSubject = new Subject<JobLogLine>();
    protected cancellationToken = new JobCancellationToken();
    protected errorSubject = new BehaviorSubject<JobError>(null);
    protected childJobStarted = new Subject<JobInstance>();
    private childJobs: JobInstance[] = [];

    constructor(
        public readonly definition: TJobDef,
        public readonly executionConfiguration: JobExecutionConfiguration<TJobDef, TResult, TProgress>,
        jobRunner: IJobRunner) {

        this.logSubject
            .subscribe(line => {
                this.logs.push(line);
            });

        this.completed
            .pipe(take(1))
            .subscribe(result => {
                this.currentResult = result;
                this.completeJob(JobStatus.Success);
            }, (error: JobError) => {
                console.error(`Job ${definition.title} completed with errors`);
                console.error(error);
                this.errorSubject.next(error);
                this.completeJob(JobStatus.Errored);
            });

        this.cancelled
            .pipe(take(1))
            .subscribe(() => {
                this.completeJob(JobStatus.Cancelled);
            });


        definition.childJobAdded
            .subscribe(childJob => {
                this.childJobs.push(childJob);
            });

        const childJobRunner = new ChildJobRunner(this.childJobStarted, jobRunner);
        try {
            definition.startJob(
                this.cancellationToken.asObservable(),
                this.progressSubject,
                this.logSubject,
                childJobRunner);
            this.statusSubject.next(JobStatus.Running);
        } catch (e) {
            console.error(`Job ${definition.title} failed to start: ${e.message}`);
            console.error(e);
            this.completeJob(JobStatus.Errored);
        }
    }

    public cancel() {
        for (const childJob of this.children) {
            childJob.cancel();
        }
        this.cancellationToken.cancel();
    }

    protected completeJob(status: JobStatus) {
        this.statusSubject.next(status);
        this.statusSubject.complete();
        this.errorSubject.complete();
        this.statusSubject.complete();
    }
}

class ChildJobRunner implements IJobRunner {

    constructor(private childJobStarted: Subject<JobInstance>,
        private jobRunner: IJobRunner) { }

    public startJob<TJobDef extends JobDefinition<TResult, TProgress>, TResult, TProgress extends JobProgress>
        (type: Type<TJobDef>, ...providers: Provider[]) {

        const job = this.jobRunner.startJob<TJobDef, TResult, TProgress>(type, providers);
        this.childJobStarted.next(job);

        return job;
    }
}
