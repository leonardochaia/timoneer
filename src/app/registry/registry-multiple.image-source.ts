import { ImageSource, ImageSourceMultiple } from '../docker-images/image-source.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SettingsService } from '../settings/settings.service';
import { RegistryService } from './registry.service';
import { DockerHubImageSource } from '../docker-hub/docker-hub.image-source';
import { DockerHubService } from '../docker-hub/docker-hub.service';
import { DockerImageService } from '../daemon-tools/docker-image.service';
import { RegistryImageSource } from './registry.image-source';
import { DockerDaemonImageSource } from '../daemon-tools/docker-daemon.image-source';
import { FallbackToLocalDaemonSource } from './fallback-to-local-daemon.image-source';
import { CachingImageSource } from '../docker-images/caching-image-source';
import { TimCacheService } from '../tim-cache/tim-cache.service';

@Injectable()
export class RegistryImageSourceMultiple extends ImageSourceMultiple {

    constructor(
        protected readonly settings: SettingsService,
        protected readonly registry: RegistryService,
        protected readonly daemonImageSource: DockerDaemonImageSource,
        protected readonly dockerImage: DockerImageService,
        protected readonly dockerHub: DockerHubService,
        protected readonly cache: TimCacheService) {
        super();
    }

    public loadImageSources(): Observable<ImageSource[]> {
        return this.settings.getSettings()
            .pipe(
                map(settings => settings.registries
                    .map(r => {

                        // Create instances accordingly
                        let source: RegistryImageSource;
                        if (r.isDockerHub) {
                            source = new DockerHubImageSource(r, this.registry, this.dockerImage, this.dockerHub);
                        } else {
                            source = new RegistryImageSource(r, this.registry);
                        }

                        // Wrap them with a local daemon fallback
                        const fallback = new FallbackToLocalDaemonSource(source, this.daemonImageSource);

                        // Wrap them with Caching
                        const cacheDuration = r.enableCaching ? r.cacheDurationInMinutes : null;
                        return new CachingImageSource(fallback, this.cache, cacheDuration);
                    }))
            );
    }
}
