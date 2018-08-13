import { Injectable, OnDestroy, Injector, Type, ReflectiveInjector, Provider } from '@angular/core';
import { JobDefinition } from './job-definition';
import { JobInstance } from './job-instance';
import { JobStatus, JobProgress, JobError } from './jobs.model';
import { JobConfiguration } from './job-configuration';
import { BehaviorSubject, Subject } from 'rxjs';
import { JobCancellationToken } from './job-cancellation-token';
import { take } from 'rxjs/operators';
import { JobExecutionConfiguration } from './job-execution-configuration';
import { pipe } from '../../../node_modules/@angular/core/src/render3/pipe';

@Injectable()
export class JobRunnerService implements OnDestroy {

  public jobs: JobInstance<any>[] = [];

  constructor(private injector: Injector) { }

  public startJob<TResult>(type: Type<JobDefinition<TResult>>, ...providers: Provider[]) {

    providers = providers || [];
    const jobConfig = type['jobConfiguration'] as JobConfiguration;
    providers.push(
      type,
      {
        provide: JobConfiguration,
        useValue: jobConfig
      }
    );

    try {
      const injector = ReflectiveInjector.resolveAndCreate(providers, this.injector);
      const definition = injector.get(type) as JobDefinition<TResult>;

      const executionConfig = new JobExecutionConfiguration(type, providers);
      const job = this.execute(definition, executionConfig);
      this.jobs.push(job);
      return job;
    } catch (e) {
      console.error(`Failed to construct Job for type ${type.name}`);
      console.error(e);
    }
  }

  public restartJob<TResult>(job: JobInstance<TResult>) {
    const executionConfig = job.executionConfiguration;
    if (executionConfig.configuration.allowsRestart) {
      return this.startJob<TResult>(executionConfig.definition, executionConfig.providers);
    } else {
      throw new Error('This job can not be restarted');
    }
  }

  public ngOnDestroy() {
    this.jobs.forEach(job => {
      if (job.status === JobStatus.Running) {
        job.cancel();
      }
    });
  }

  protected execute<TResult>(jobDefinition: JobDefinition<TResult>, executionConfig: JobExecutionConfiguration<TResult>) {
    const currentStatus = new BehaviorSubject<JobStatus>(JobStatus.Queued);
    const resultSubject = new Subject<TResult>();
    const cancellationToken = new JobCancellationToken();
    const progressSubject = new Subject<JobProgress>();
    let job: JobInstance<TResult>;

    try {

      job = new JobInstance(
        jobDefinition,
        executionConfig,
        currentStatus,
        resultSubject.asObservable(),
        progressSubject,
        cancellationToken);

      jobDefinition.startJob(cancellationToken.asObservable(), progressSubject);
      currentStatus.next(JobStatus.Running);
    } catch (e) {
      currentStatus.next(JobStatus.Errored);
      console.error(`Failed to start job ${jobDefinition.title}`);
      console.error(e);
    }

    if (currentStatus.value === JobStatus.Running) {

      jobDefinition.completed
        .pipe(take(1))
        .subscribe(result => {
          currentStatus.next(JobStatus.Success);
          resultSubject.next(result);
          resultSubject.complete();
        }, (error: JobError) => {
          console.error(`Job ${jobDefinition.title} reported an error: ${error.message}`);
          currentStatus.next(JobStatus.Errored);
        });

      job.cancelled
        .pipe(take(1))
        .subscribe(() => {
          currentStatus.next(JobStatus.Cancelled);
        });

      return job;
    }
  }
}
