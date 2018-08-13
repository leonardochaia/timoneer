import { JobDefinition } from './job-definition';
import { Job } from './job.decorator';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Optional } from '@angular/core';

export class TestJobParams {
    constructor(public readonly requiredClicks: number) { }
}

@Job({
    allowsRestart: true
})
export class TestJob extends JobDefinition<string> {
    public get title() {
        return `Click ${this.requiredClicks} times!`;
    }

    protected clickCount = 0;

    protected get requiredClicks() {
        return this.params.requiredClicks;
    }

    constructor(
        @Optional()
        private params: TestJobParams) {
        super();
        this.params = params || new TestJobParams(30);
    }

    public start() {
        // this.reportClicksProgress();
        fromEvent(window, 'click')
            .pipe(
                takeUntil(this.completed),
                takeUntil(this.cancelled)
            )
            .subscribe((e: MouseEvent) => {
                if (!e.ctrlKey) {
                    this.clickCount++;
                    this.reportClicksProgress();
                    if (this.clickCount >= this.requiredClicks) {
                        this.complete(`You clicked ${this.clickCount} times!`);
                    }
                } else {
                    this.completeWithError({
                        message: 'You have to click the primary mouse button!'
                    });
                }
            });
    }

    protected reportClicksProgress() {
        this.progress({
            percent: (this.clickCount / this.requiredClicks) * 100,
            message: `${this.requiredClicks - this.clickCount} Clicks Remaining`
        });
    }
}
