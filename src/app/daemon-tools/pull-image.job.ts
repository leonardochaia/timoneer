import { takeUntil } from 'rxjs/operators';
import { DockerImageService } from '../daemon-tools/docker-image.service';
import { DockerStreamResponse } from '../daemon-tools/docker-client.model';
import { JobDefinition } from '../jobs/job-definition';
import { Job } from '../jobs/job.decorator';
import { JobProgress } from '../jobs/jobs.model';
import { PullImageJobLogsComponent } from './pull-image-job-logs/pull-image-job-logs.component';

export class PullImageJobParams {
    constructor(public readonly image: string) { }
}

export interface PullImageJobProgress extends DockerStreamResponse, JobProgress { }

@Job({
    logsComponent: PullImageJobLogsComponent,
})
export class PullImageJob extends JobDefinition<void, PullImageJobProgress> {
    public get title() {
        return `Pull ${this.image}`;
    }

    public get responses() {
        return Array.from(this.responseMap.values());
    }

    protected progressMap = new Map<string, { total: number, current: number }>();
    protected responseMap = new Map<string, PullImageJobProgress>();

    protected get image() {
        return this.params.image;
    }

    constructor(protected params: PullImageJobParams,
        protected imageService: DockerImageService) {
        super();
    }

    public start() {
        this.progress({
            message: `Pulling from ${this.image}`
        } as Partial<PullImageJobProgress> as PullImageJobProgress);

        this.imageService.pullImage(this.image)
            .pipe(takeUntil(this.cancelled))
            .subscribe(response => {
                const jobProgress = Object.assign({}, response, <JobProgress>{
                    message: response.status,
                    percent: this.calculateTotalPercent()
                });

                this.progress(jobProgress);

            }, (error: { message: string }) => {
                this.completeWithError(error);
            }, () => {
                if (!this.isCancelled) {
                    this.complete(null);
                }
            });
    }

    protected progress(progress: PullImageJobProgress) {
        if (progress.id && this.responseMap.has(progress.id)) {
            this.responseMap.set(progress.id, progress);
        } else {
            this.responseMap.set(progress.id || progress.status, progress);
        }
        super.progress(progress);
    }

    protected calculateTotalPercent() {
        let current = 0;
        let total = 0;
        this.responseMap.forEach(response => {
            const progress = response.progressDetail;
            if (progress && progress.total && progress.current
                && !isNaN(progress.total) && !isNaN(progress.current)) {
                current += progress.current;
                total += progress.total;
            }
        });
        return (current / total) * 100;
    }
}
