import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, } from 'rxjs/operators';
import parsers from 'www-authenticate/lib/parsers';

@Injectable({
  providedIn: 'root'
})
export class RegistryAuthService {

  constructor(private httpClient: HttpClient) { }

  public getAccesstokenFromHeader(header: string, registryUrl: string, username: string, password: string) {
    const parsed = new parsers.WWW_Authenticate(header).parms;
    const clientId = 'Timoneer';
    return this.getAccesstoken(parsed.realm, parsed.service, parsed.scope, clientId, username, password);
  }

  protected getAccesstoken(
    url: string,
    service: string,
    scope: string,
    clientId: string,
    username: string,
    password: string) {

    let headers: { Authorization: string };
    if (username && password) {
      const basic = btoa(`${username}:${password}`);
      headers = {
        Authorization: `Basic ${basic}`
      };
    }
    return this.httpClient.get<{ token: string }>(url,
      {
        params: {
          service: service,
          scope: scope,
          clientId: clientId,
        },
        headers: headers
      }).pipe(map(r => {
        return r.token;
      }));
  }
}
