import { BehaviorSubject } from 'rxjs';
import { JobStatus, JobProgress, JobError } from './jobs.model';
import { JobCancellationToken } from './job-cancellation-token';
import { take } from 'rxjs/operators';
import { JobExecutionConfiguration } from './job-execution-configuration';
import { JobDefinition } from './job-definition';

export class JobInstance<Tdefinition
    extends JobDefinition<TResult> = JobDefinition<any>,
    TResult = any,
    TProgress extends JobProgress = JobProgress> {

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

    public readonly progressHistory: TProgress[] = [];

    protected currentResult: TResult;

    protected statusSubject = new BehaviorSubject<JobStatus>(JobStatus.Queued);
    protected progressSubject = new BehaviorSubject<TProgress>(<TProgress>{});
    protected cancellationToken = new JobCancellationToken();
    protected errorSubject = new BehaviorSubject<JobError>(null);

    constructor(
        public readonly definition: Tdefinition,
        public readonly executionConfiguration: JobExecutionConfiguration<TResult, TProgress>) {

        this.progress
            .subscribe(p => {
                this.progressHistory.push(p);
            });

        this.completed
            .pipe(take(1))
            .subscribe(result => {
                this.currentResult = result;
                this.completeJob(JobStatus.Success);
            }, (error: JobError) => {
                console.error(`Job ${definition.title} completed with errors`);
                console.log(error);
                this.errorSubject.next(error);
                this.completeJob(JobStatus.Errored);
            });

        this.cancelled
            .pipe(take(1))
            .subscribe(() => {
                this.completeJob(JobStatus.Cancelled);
            });

        try {
            definition.startJob(this.cancellationToken.asObservable(), this.progressSubject);
            this.statusSubject.next(JobStatus.Running);
        } catch (e) {
            console.error(`Job ${definition.title} failed to start: ${e.message}`);
            console.error(e);
            this.completeJob(JobStatus.Errored);
        }
    }

    public cancel() {
        this.cancellationToken.cancel();
    }

    protected completeJob(status: JobStatus) {
        this.statusSubject.next(status);
        this.statusSubject.complete();
        this.errorSubject.complete();
        this.statusSubject.complete();
    }
}
