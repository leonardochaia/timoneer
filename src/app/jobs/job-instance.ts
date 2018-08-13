import { BehaviorSubject, Observable } from 'rxjs';
import { JobStatus, JobProgress } from './jobs.model';
import { JobCancellationToken } from './job-cancellation-token';
import { takeUntil } from 'rxjs/operators';
import { JobExecutionConfiguration } from './job-execution-configuration';
import { JobDefinition } from './job-definition';

export class JobInstance<TResult> {

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

    protected currentProgressResult: JobProgress = {};

    constructor(
        public readonly definition: JobDefinition<TResult>,
        public readonly executionConfiguration: JobExecutionConfiguration<TResult>,
        protected statusSubject: BehaviorSubject<JobStatus>,
        public readonly completed: Observable<TResult>,
        public readonly progress: Observable<JobProgress>,
        protected cancellationToken: JobCancellationToken) {
        this.progress
            .pipe(
                takeUntil(completed),
                takeUntil(cancellationToken.asObservable())
            )
            .subscribe(p => {
                this.currentProgressResult = p;
            });
    }

    public cancel() {
        this.cancellationToken.cancel();
    }
}
