import { Injectable, OnDestroy, Injector, Type, ReflectiveInjector, Provider } from '@angular/core';
import { JobDefinition } from './job-definition';
import { JobInstance } from './job-instance';
import { JobStatus, IJobRunner } from './jobs.model';
import { JobConfiguration } from './job-configuration';
import { JobExecutionConfiguration } from './job-execution-configuration';

@Injectable()
export class JobRunnerService implements OnDestroy, IJobRunner {

  public jobs: JobInstance<JobDefinition<any>, any>[] = [];

  constructor(private injector: Injector) { }

  public startJob<TResult, TProgress>(type: Type<JobDefinition<TResult, TProgress>>, ...providers: Provider[]) {

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
      const definition = injector.get(type) as JobDefinition<TResult, TProgress>;

      const executionConfig = new JobExecutionConfiguration(type, providers);
      return this.execute(definition, executionConfig);
    } catch (e) {
      console.error(`Failed to construct Job for type ${type.name}`);
      console.error(e);
    }
  }

  public restartJob<TJobDef extends JobDefinition<TResult>, TResult, TProgress>(
    job: JobInstance<TJobDef, TResult, TProgress>) {

    const executionConfig = job.executionConfiguration;
    if (executionConfig.configuration.allowsRestart) {
      return this.startJob<TResult, TProgress>(executionConfig.definition, executionConfig.providers);
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

  protected execute<TJobDef extends JobDefinition<TResult>, TResult, TProgress>(
    jobDefinition: TJobDef,
    executionConfig: JobExecutionConfiguration<TResult, TProgress>) {

    jobDefinition.childJobAdded
      .subscribe(childJob => {
        const index = this.jobs.indexOf(childJob);
        this.jobs.splice(index, 1);
      });

    const job = new JobInstance(jobDefinition, executionConfig, this);
    this.jobs.push(job);

    return job;
  }
}
