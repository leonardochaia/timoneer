import { InjectionToken, Type, Provider } from '@angular/core';
import { JobDefinition } from './job-definition';
import { JobInstance } from './job-instance';

export enum JobStatus {
    Queued = 'Queued',
    Running = 'Running',
    Success = 'Success',
    Errored = 'Errored',
    Cancelled = 'Cancelled',
}

export interface JobProgress {
    percent?: number;
    message?: string;
    childJob?: JobInstance;
    date?: Date;
}

export interface JobError {
    message: string;
}

export const CURRENT_JOB = new InjectionToken<string>('CurrentJob');

export interface IJobRunner {
    startJob<TJobDef extends JobDefinition<TResult, TProgress>, TResult, TProgress>(type: Type<TJobDef>,
        ...providers: Provider[])
        : JobInstance<TJobDef, TResult, TProgress>;
}
