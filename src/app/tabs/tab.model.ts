import { Type } from '@angular/core';

export const TAB_DATA = 'TimoneerTabData';
export const APPLICATION_TABS = 'ApplicationTabs';

export interface ITimoneerTab {
    id: string;
    title?: string;
    component: Type<any>;
    componentInstance?: any;
    params?: any;
    multiple?: boolean;
    replaceCurrent?: boolean;
}

export interface OnTabFocused {
    timTabFocused(): void;
}

export interface OnTabAnimationDone {
    timTabAnimationDone(): void;
}
