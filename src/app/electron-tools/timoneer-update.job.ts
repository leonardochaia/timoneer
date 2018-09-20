import { JobDefinition } from '../jobs/job-definition';
import { Job } from '../jobs/job.decorator';
import { UpdaterService } from './updater.service';
import { takeUntil } from 'rxjs/operators';
import { ProgressInfo } from 'builder-util-runtime';
import { JobProgress } from '../jobs/jobs.model';
import { BytesToHumanPipe } from '../shared/bytes-to-human.pipe';

export interface TimoneerUpdateJobProgress extends ProgressInfo, JobProgress { }

@Job()
export class TimoneerUpdateJob extends JobDefinition<string, TimoneerUpdateJobProgress> {
    public get title() {
        return `Checking for updates`;
    }

    protected get currentVersion() {
        return this.updater.currentVersion.version as string;
    }

    protected get latestVersion() {
        return this.updater.latestVersion.version;
    }

    private bytePipe: BytesToHumanPipe;

    constructor(
        private updater: UpdaterService) {
        super();
        this.bytePipe = new BytesToHumanPipe();
    }

    public start() {
        this.log('Checking for updates');

        this.updater.checkForUpdates()
            .then((checkResult) => {
                console.log(checkResult);
                if (this.latestVersion !== this.currentVersion) {
                    this.log(`Downloading Timoneer v${this.latestVersion}`);

                    this.updater.downloadProgress
                        .pipe(
                            takeUntil(this.cancelled),
                            takeUntil(this.completed)
                        )
                        .subscribe(progress => {
                            if (progress) {
                                const jobProgress = progress as TimoneerUpdateJobProgress;
                                const current = this.bytePipe.transform(jobProgress.transferred);
                                const total = this.bytePipe.transform(jobProgress.total);
                                jobProgress.message = `Downloading ${current} / ${total}`;
                                this.progress(jobProgress);
                            }
                        });

                    // TODO: Cancellation is not working properly.
                    // const cancellationToken = new CancellationToken();
                    // this.cancelled.subscribe(() => {
                    //     cancellationToken.cancel();
                    // });
                    // this.updater.downloadLatestUpdate(cancellationToken)

                    this.updater.downloadLatestUpdate()
                        .then((r) => {
                            this.log(`Timoneer v${this.latestVersion} downloaded`);
                            console.log(r);

                            this.complete(checkResult.updateInfo.releaseName);
                        }, error => {
                            this.completeWithError({
                                message: error.message || 'An error ocurred while updating'
                            });
                        });

                } else {
                    this.complete(`Timoneer is up to date. v${this.currentVersion} is the latest version`);
                }
            }, error => {
                this.completeWithError({
                    message: error.message || 'An error ocurred while updating'
                });
            });
    }
}
