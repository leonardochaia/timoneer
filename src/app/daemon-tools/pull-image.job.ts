import { takeUntil } from 'rxjs/operators';
import { DockerImageService } from '../daemon-tools/docker-image.service';
import { DockerStreamResponse } from '../daemon-tools/docker-client.model';
import { JobDefinition } from '../jobs/job-definition';
import { Job } from '../jobs/job.decorator';
import { JobProgress } from '../jobs/jobs.model';
import { PullImageJobDetailsComponent } from './pull-image-job-details/pull-image-job-details.component';

export class PullImageJobParams {
    constructor(public readonly image: string) { }
}

export interface PullImageJobProgress extends DockerStreamResponse, JobProgress { }

@Job({
    detailsComponent: PullImageJobDetailsComponent,
})
export class PullImageJob extends JobDefinition<void, PullImageJobProgress> {
    public get title() {
        return `Pull ${this.image}`;
    }

    public readonly responses: DockerStreamResponse[] = [];

    protected progressMap = new Map<string, { total: number, current: number }>();

    protected get image() {
        return this.params.image;
    }

    constructor(protected params: PullImageJobParams,
        protected imageService: DockerImageService) {
        super();
    }

    public start() {

        this.imageService.pullImage(this.image)
            .pipe(takeUntil(this.cancelled))
            .subscribe(response => {

                const cached = response.id && this.responses.filter(k => k.id === response.id)[0];

                if (cached) {
                    Object.assign(cached, response);
                } else {
                    if (this.imageService.isUserFriendlyResponse(response)) {
                        this.responses.push(response);
                    }
                }

                // Keep a map of valid responses progressDetails
                // to calculate total progress of the entire pull
                if (response.progressDetail && response.progressDetail.total && response.progressDetail.current) {
                    this.progressMap.set(response.id, response.progressDetail);
                }

                let current = 0;
                let total = 0;
                this.progressMap.forEach(p => {
                    current += p.current;
                    total += p.total;
                });

                const progress = Object.assign({}, response, <JobProgress>{
                    message: response.status,
                    percent: (current / total) * 100
                });

                this.progress(progress);
            }, (error: { message: string }) => {
                this.completeWithError(error);
            }, () => {
                this.complete(null);
            });
    }
}
