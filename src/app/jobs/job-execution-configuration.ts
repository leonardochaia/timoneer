import { Provider } from '@angular/compiler/src/core';
import { JobDefinition } from './job-definition';
import { Type } from '@angular/core';
import { JobConfiguration } from './job-configuration';
import { JobProgress } from './jobs.model';

export class JobExecutionConfiguration<TJobDef
    extends JobDefinition<TResult, TProgress>, TResult, TProgress extends JobProgress = JobProgress> {
    public get configuration() {
        return this.definition['jobConfiguration'] as JobConfiguration;
    }
    constructor(public readonly definition: Type<TJobDef>,
        public readonly providers: Provider[],
    ) { }
}
