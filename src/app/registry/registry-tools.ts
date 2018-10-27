
import * as urlParse from 'url-parse';
import { DockerRegistrySettings } from '../settings/settings.model';

export function getRegistryDNSName(url: string) {
    const urlInfo = urlParse(url, {});
    return urlInfo.host;
}

export function getRegistryName(registry: DockerRegistrySettings) {
    if (registry.isDockerHub) {
        return 'Docker Hub';
    } else {
        return getRegistryDNSName(registry.url);
    }
}
