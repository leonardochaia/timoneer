import { BehaviorSubject, Observable } from 'rxjs';
import { JobStatus, JobProgress, JobError } from './jobs.model';
import { JobCancellationToken } from './job-cancellation-token';
import { takeUntil } from 'rxjs/operators';
import { JobExecutionConfiguration } from './job-execution-configuration';
import { JobDefinition } from './job-definition';

export class JobInstance<TJobDefinition
    extends JobDefinition<TResult> = JobDefinition<any>,
    TResult = any,
    TProgress extends JobProgress = JobProgress> {

    public get status() {
        return this.statusSubject.value;
    }

    public get cancelled() {
        return this.cancellationToken.asObservable();
    }

    public get statusChange() {
        return this.statusSubject.asObservable();
    }

    public get currentProgress() {
        return this.currentProgressResult;
    }

    public get configuration() {
        return this.executionConfiguration.configuration;
    }

    public get result() {
        return this.currentResult;
    }

    public get error() {
        return this.currentError;
    }

    public readonly progressHistory: TProgress[] = [];

    protected currentProgressResult: TProgress = <TProgress>{};
    protected currentResult: TResult;
    protected currentError: JobError;

    constructor(
        public readonly definition: TJobDefinition,
        public readonly executionConfiguration: JobExecutionConfiguration<TResult, TProgress>,
        protected statusSubject: BehaviorSubject<JobStatus>,
        public readonly completed: Observable<TResult>,
        public readonly progress: Observable<TProgress>,
        protected cancellationToken: JobCancellationToken) {
        this.progress
            .subscribe(p => {
                this.currentProgressResult = p;
                this.progressHistory.push(p);
            });

        this.completed
            .subscribe(r => {
                this.currentResult = r;
            }, (error: JobError) => {
                console.log(error);
                this.currentError = error;
            });
    }

    public cancel() {
        this.cancellationToken.cancel();
    }
}
