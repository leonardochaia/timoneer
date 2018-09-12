import { Injectable, Type } from '@angular/core';
import { JobConfiguration } from './job-configuration';
import { JobDefinition } from './job-definition';

export function Job(config?: JobConfiguration) {
    return function (target: Type<JobDefinition<any>>) {
        const inj = Injectable();
        inj(target);
        target['jobConfiguration'] = Object.assign(new JobConfiguration(), config);
    };
}
