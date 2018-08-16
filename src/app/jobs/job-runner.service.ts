import { Injectable, OnDestroy, Injector, Type, ReflectiveInjector, Provider } from '@angular/core';
import { JobDefinition } from './job-definition';
import { JobInstance } from './job-instance';
import { JobStatus, IJobRunner, JobProgress } from './jobs.model';
import { JobConfiguration } from './job-configuration';
import { JobExecutionConfiguration } from './job-execution-configuration';

@Injectable()
export class JobRunnerService implements OnDestroy, IJobRunner {

  public jobs: JobInstance<JobDefinition<any>, any>[] = [];

  constructor(private injector: Injector) { }

  public startJob<TJobDef extends JobDefinition<TResult, TProgress>, TResult, TProgress>(type: Type<TJobDef>,
    ...providers: Provider[])
    : JobInstance<TJobDef, TResult, TProgress> {

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
      const definition = injector.get(type) as TJobDef;

      const executionConfig = new JobExecutionConfiguration<TJobDef, TResult, TProgress>(type, providers);
      return this.execute<TJobDef, TResult, TProgress>(definition, executionConfig);
    } catch (e) {
      console.error(`Failed to construct Job for type ${type.name}`);
      console.error(e);
    }
  }

  public restartJob<TJobDef extends JobDefinition<TResult, TProgress>, TResult, TProgress>(
    job: JobInstance<TJobDef, TResult, TProgress>) {

    const executionConfig = job.executionConfiguration;
    if (executionConfig.configuration.allowsRestart) {
      return this.startJob<TJobDef, TResult, TProgress>(executionConfig.definition, executionConfig.providers);
    } else {
      throw new Error('This job can not be restarted');
    }
  }

  public getJobById<TJobDef extends JobDefinition<TResult, TProgress>,
    TResult, TProgress extends JobProgress>(id: string) {
    const recursion = (jobs: JobInstance[]) => {
      for (const job of jobs) {
        if (job.id === id) {
          return job;
        }

        const found = recursion(job.children);
        if (found) {
          return found;
        }
      }
    };

    return recursion(this.jobs) as JobInstance<TJobDef, TResult, TProgress>;
  }

  public ngOnDestroy() {
    this.jobs.forEach(job => {
      if (job.status === JobStatus.Running) {
        job.cancel();
      }
    });
  }

  protected execute<TJobDef extends JobDefinition<TResult, TProgress>, TResult, TProgress>(
    jobDefinition: TJobDef,
    executionConfig: JobExecutionConfiguration<TJobDef, TResult, TProgress>) {

    jobDefinition.childJobAdded
      .subscribe(childJob => {
        const index = this.jobs.indexOf(childJob);
        if (index >= 0) {
          this.jobs.splice(index, 1);
        }
      });

    const job = new JobInstance<TJobDef, TResult, TProgress>(jobDefinition, executionConfig, this);
    this.jobs.push(job);

    return job;
  }
}
