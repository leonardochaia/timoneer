import {
    ImageSource,
    ImageListFilter,
    ImageListItemData,
    ImageSourceMultiple,
    ImageSourceAuthenticated
} from '../docker-images/image-source.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SettingsService } from '../settings/settings.service';
import { RegistryService } from './registry.service';
import { DockerRegistrySettings } from '../settings/settings.model';

@Injectable()
export class RegistryImageSourceMultiple extends ImageSourceMultiple {

    constructor(
        protected readonly settings: SettingsService,
        protected readonly registry: RegistryService) {
        super();
    }

    public loadImageSources(): Observable<ImageSource[]> {
        return this.settings.getSettings()
            .pipe(
                map(settings => settings.registries
                    .filter(s => s.allowsCatalog)
                    .map(r => new RegistryImageSource(r, this.registry, this.settings)))
            );
    }
}

export class RegistryImageSource
    extends ImageSource
    implements ImageSourceAuthenticated {

    public get name() {
        return this.settings.getRegistryName(this.registrySettings).replace('/', '');
    }

    public readonly username;

    constructor(
        protected readonly registrySettings: DockerRegistrySettings,
        protected readonly registry: RegistryService,
        protected readonly settings: SettingsService) {
        super();
        this.username = registrySettings.username;
    }

    public loadList(filter?: ImageListFilter): Observable<ImageListItemData[]> {
        filter = filter || {};
        return this.registry.getRepositories(this.registrySettings.url)
            .pipe(
                map(r => r.map(image => ({
                    name: `${this.name}/${image}`,
                    displayName: image
                } as ImageListItemData))
                    .filter(item => !filter.term || item.name.includes(filter.term))),
            );
    }
}
