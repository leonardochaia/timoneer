import { Type } from '@angular/core';

export const TAB_DATA = 'TimoneerTabData';

export interface ITimoneerTab {
    title: string;
    component: Type<any>;
    componentInstance?: any;
    params?: any;
}
