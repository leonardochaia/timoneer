import { Provider } from '@angular/compiler/src/core';
import { JobDefinition } from './job-definition';
import { Type } from '@angular/core';
import { JobConfiguration } from './job-configuration';

export class JobExecutionConfiguration<TResult> {
    public get configuration() {
        return this.definition['jobConfiguration'] as JobConfiguration;
    }
    constructor(public readonly definition: Type<JobDefinition<TResult>>,
        public readonly providers: Provider[],
    ) { }
}
