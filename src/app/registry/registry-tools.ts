
import * as urlParse from 'url-parse';

export function getRegistryDNSName(url: string) {
    const urlInfo = urlParse(url, {});
    return urlInfo.host;
}
