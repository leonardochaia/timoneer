import { Type } from '@angular/core';

export const TAB_DATA = 'TimoneerTabData';
export const APPLICATION_TABS = 'ApplicationTabs';

export interface TabConfiguration {
    /**
     * Unique identifier for tabs.
     * Used for opening a tab later on.
    */
    id: string;

    /**
     * The title that will be shown.
    */
    title?: string;

    /**
     * The component to instantiate for the Tab.
    */
    component: Type<any>;

    /**
     * Whether multiple tabs with the same configuration
     * are allowed. The Tab will be focused if it exists.
    */
    multiple?: boolean;
}

export interface TabCreationConfiguration {
    /**
     * The title that will be shown.
    */
    title?: string;

    /**
     * Parameters to send to the Tab's
     * component through the TAB_DATA injection token.
    */
    params?: any;
}

export interface TabInstanceConfiguration
    extends TabConfiguration, TabCreationConfiguration {
}

export class Tab {
    public get configuration() {
        return this.config;
    }

    public get id() {
        return this.config.id;
    }

    public get componentInstance() {
        return this.component;
    }

    protected component: any;

    constructor(protected config: TabInstanceConfiguration) { }

    public setComponent(instance: any) {
        if (this.componentInstance) {
            throw new Error(`Tab ${this.id} already has a component`);
        }
        this.component = instance;
    }

    public compare(config: TabInstanceConfiguration) {
        return config.id === this.id
            && config.params === this.config.params
            && config.title === this.config.title;
    }
}

export interface OnTabFocused {
    timTabFocused(): void;
}

export interface OnTabAnimationDone {
    timTabAnimationDone(): void;
}
