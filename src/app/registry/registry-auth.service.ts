import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistryAuthService {

  private tokenCache: { [key: string]: string } = {};

  constructor(private httpClient: HttpClient) { }

  public getAccesstokenFromHeader(header: string, registryUrl: string, username: string, password: string) {
    const parsed = this.parseWwwAuthenticateHeader(header);
    const clientId = 'ui-test';

    const cacheKey = this.getCacheKey(registryUrl, parsed.service, parsed.scope, clientId, username, password);
    if (this.isCached(cacheKey)) {
      return of(this.tokenCache[cacheKey]);
    }

    return this.getAccesstoken(parsed.realm, parsed.service, parsed.scope, clientId, username, password)
      .pipe(map(token => {
        return this.tokenCache[cacheKey] = token;
      }));
  }

  public getAccessTokenForUrl(registryUrl: string) {
    const key = Object.keys(this.tokenCache).filter(k => k.includes(registryUrl))[0];
    if (key) {
      return this.tokenCache[key];
    } else {
      return null;
    }
  }

  protected getAccesstoken(
    url: string,
    service: string,
    scope: string,
    clientId: string,
    username: string,
    password: string) {

    const authHeader = btoa(`${username}:${password}`);
    return this.httpClient.post<{ token: string }>(url, null, {
      params: {
        service: service,
        scope: scope,
        clientId: clientId,
      }, headers: {
        Authorization: `Basic ${authHeader}`
      }
    }).pipe(map(r => {
      return r.token;
    }));
  }

  protected parseWwwAuthenticateHeader(header: string) {
    const parts = header.split(',');
    const realm = parts.filter(p => p.indexOf('Bearer realm=') >= 0)[0];
    const service = parts.filter(p => p.indexOf('service=') >= 0)[0];
    const scope = parts.filter(p => p.indexOf('scope=') >= 0)[0];
    return {
      realm: realm.replace('Bearer realm="', '').replace('"', ''),
      service: service.replace('service="', '').replace('"', ''),
      scope: scope.replace('scope="', '').replace('"', ''),
    };
  }

  protected getFromCache(key: string) {
    return this.tokenCache[key];
  }

  protected isCached(key) {
    return !!this.tokenCache[key];
  }

  protected getCacheKey(url: string,
    service: string,
    scope: string,
    clientId: string,
    username: string,
    password: string) {

    return `${url}-${btoa(service + scope + clientId + username + password)}`;
  }
}
