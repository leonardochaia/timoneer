import { JobDefinition } from './job-definition';
import { Job } from './job.decorator';
import { takeUntil, finalize } from 'rxjs/operators';
import { DockerImageService } from '../daemon-tools/docker-image.service';
import { DockerStreamResponse } from '../daemon-tools/docker-client.model';

export class PullImageJobParams {
    constructor(public readonly image: string) { }
}

@Job()
export class PullImageJob extends JobDefinition<void> {
    public get title() {
        return `Pull ${this.image}`;
    }

    public responses: DockerStreamResponse[] = [];

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
            .pipe(
                takeUntil(this.completed),
                takeUntil(this.cancelled),
                finalize(() => {
                    this.complete(null);
                })
            )
            .subscribe(response => {

                const cached = response.id && this.responses.filter(k => k.id === response.id)[0];

                if (!cached) {
                    this.responses.push(response);
                } else {
                    Object.assign(cached, response);
                }

                if (response.progressDetail && response.progressDetail.total && response.progressDetail.current) {
                    this.progressMap.set(response.id, response.progressDetail);
                }

                let current = 0;
                let total = 0;
                this.progressMap.forEach(p => {
                    current += p.current;
                    total += p.total;
                });

                const progress = (current / total) * 100;

                this.progress({
                    message: response.status,
                    percent: progress
                });
            }, (error: { message: string }) => {
                this.completeWithError(error);
            });
    }
}
