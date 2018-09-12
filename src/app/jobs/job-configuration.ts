import { Type } from '@angular/core';

export class JobConfiguration {
    public readonly allowsRestart?: boolean = true;
    public readonly allowsCancel?: boolean = true;
    public readonly logsComponent?: Type<any>;
}
