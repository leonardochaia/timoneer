import { InjectionToken } from '@angular/core';

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
}

export interface JobError {
    message: string;
}

export const JOB_DETAILS_JOB = new InjectionToken<string>('JobDetailsJob');
