import {
    ImageSource,
    ImageSourceMultiple
} from '../docker-images/image-source.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SettingsService } from '../settings/settings.service';
import { RegistryService } from './registry.service';

import { DockerHubImageSource } from '../docker-hub/docker-hub.image-source';
import { DockerHubService } from '../docker-hub/docker-hub.service';
import { DockerImageService } from '../daemon-tools/docker-image.service';
import { RegistryImageSource } from './registry.image-source';

@Injectable()
export class RegistryImageSourceMultiple extends ImageSourceMultiple {

    constructor(
        protected readonly settings: SettingsService,
        protected readonly registry: RegistryService,
        protected readonly dockerImage: DockerImageService,
        protected readonly dockerHub: DockerHubService) {
        super();
    }

    public loadImageSources(): Observable<ImageSource[]> {
        return this.settings.getSettings()
            .pipe(
                map(settings => settings.registries
                    .map(r => {
                        // Create instances accordingly
                        if (r.isDockerHub) {
                            return new DockerHubImageSource(r, this.registry, this.dockerImage, this.dockerHub);
                        } else {
                            return new RegistryImageSource(r, this.registry);
                        }
                    }))
            );
    }
}
