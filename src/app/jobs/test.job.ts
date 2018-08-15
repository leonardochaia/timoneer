import { JobDefinition } from './job-definition';
import { Job } from './job.decorator';
import { fromEvent, Observable } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Optional } from '@angular/core';
import { JobError } from './jobs.model';
import { PullImageJobParams, PullImageJob } from '../daemon-tools/pull-image.job';

export class TestJobParams {
    constructor(
        public readonly requiredClicks: number,
        public readonly isChild = false
    ) { }
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

        if (!this.params.isChild) {
            this.progress({
                percent: 0,
                message: 'Creating a new child job'
            });
            const childJob = this.startChildJob(TestJob, {
                provide: TestJobParams,
                useValue: new TestJobParams(4, true),
            });

            this.progress({
                percent: 30,
                message: 'Waiting For child Job'
            });

            childJob.completed
                .subscribe(childResult => {

                    this.progress({
                        percent: 50,
                        message: `Child Job Finished: ${childResult}`
                    });

                    const params = new PullImageJobParams('ubuntu');
                    const imageJob = this.startChildJob(PullImageJob, {
                        provide: PullImageJobParams,
                        useValue: params
                    });

                    imageJob.completed
                        .subscribe(() => {
                            this.complete('Finished test!');
                        }, error => {
                            this.completeWithError({
                                message: `Image pull finished with errors: ${error.message}`
                            });
                        });

                });
        } else {
            this.progress({
                message: 'Binding to click events..'
            });
            this.bindClicks(fromEvent(window, 'click') as Observable<MouseEvent>);
        }
    }

    protected bindClicks(obs: Observable<MouseEvent>) {
        return obs
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
            }, (e: JobError) => {
                this.progress({
                    message: `Child JobFailed`
                });
                this.completeWithError(e);
            });
    }

    protected reportClicksProgress() {
        this.progress({
            percent: (this.clickCount / this.requiredClicks) * 100,
            message: `${this.requiredClicks - this.clickCount} Clicks Remaining`
        });
    }
}
