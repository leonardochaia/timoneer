import { takeUntil, map, catchError, switchMap } from 'rxjs/operators';
import { JobDefinition } from '../jobs/job-definition';
import { Job } from '../jobs/job.decorator';
import { ContainerCreateBody, Container } from 'dockerode';
import { DockerContainerService } from './docker-container.service';
import { PullImageJobParams, PullImageJob } from './pull-image.job';
import { DockerImageService } from './docker-image.service';
import { throwError, from, Subject } from 'rxjs';

export class ContainerCreationJobParams {
    constructor(public readonly creationData: ContainerCreateBody) { }
}

@Job()
export class ContainerCreationJob extends JobDefinition<string> {
    public get title() {
        if (this.creationData.name) {
            return `Create ${this.creationData.name}`;
        } else {
            return `Create from ${this.creationData.Image}`;
        }
    }

    public get creationData() {
        return this.params.creationData;
    }

    public get containerCreated() {
        return this.containerCreatedSubject.asObservable();
    }

    protected readonly containerCreatedSubject = new Subject<string>();

    constructor(protected params: ContainerCreationJobParams,
        protected imageService: DockerImageService,
        protected containerService: DockerContainerService) {
        super();
    }

    public start() {
        this.pullImage()
            .pipe(switchMap(() => {
                this.progressAndLog({
                    percent: 75,
                    message: 'Creating container'
                });
                return this.containerService.create(this.creationData)
                    .pipe(
                        takeUntil(this.cancelled),
                        switchMap(container => {
                            this.progressAndLog({
                                percent: 80,
                                message: `Starting container ${container.id}`
                            });
                            this.containerCreatedSubject.next(container.id);
                            return from(container.start() as Promise<Container>);
                        })
                    );
            }))
            .subscribe(container => {
                this.progressAndLog({
                    percent: 100,
                    message: `Container started`
                });

                this.complete(container.id);
            }, e => {
                this.completeWithError(e);
            });

    }

    protected pullImage() {
        const image = this.creationData.Image;
        this.progressAndLog({
            percent: 0,
            message: `Inspecting image ${image}`
        });
        return this.imageService.inspectImage(image)
            .pipe(
                map(imageInfo => {

                    this.progressAndLog({
                        percent: 50,
                        message: `Obtained image metadata ${image}`
                    });

                    return imageInfo;
                }),
                catchError((error: { statusCode: number, message: string }) => {

                    if (error.statusCode === 404) {
                        this.progressAndLog({
                            percent: 25,
                            message: `Image ${image} not found in daemon`
                        });
                        const job = this.startPullImageJob();
                        return job.completed
                            .pipe(switchMap(() => {
                                this.progressAndLog({
                                    percent: 50,
                                    message: `Obtained Image ${image}`
                                });
                                return this.imageService.inspectImage(image);
                            }));
                    } else {
                        return throwError(error);
                    }
                }),
            );

    }

    protected startPullImageJob() {
        const params = new PullImageJobParams(this.creationData.Image);
        return this.startChildJob(PullImageJob, {
            provide: PullImageJobParams,
            useValue: params
        });
    }
}
