import { Injectable } from '@angular/core';
import { Application } from './application.model';
import { of } from 'rxjs';


const APPLICATIONS: Application[] = [
  {
    id: 'nginx',
    title: 'NGINX',
    image: 'nginx:alpine',
    description: 'Awesome NGINX Proxy!',
    ports: [
      {
        containerPort: 80,
        hostPort: 80,
        description: 'NGINX HTTP '
      }
    ],
    volumes: []
  },
  {
    id: 'alpine',
    title: 'Linux Alpine',
    image: 'alpine',
    description: 'Alpine linux',
    ports: [],
    volumes: []
  }
];

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  public getApplications() {
    return of(APPLICATIONS.slice());
  }

  public getApplication(id: string) {
    const app = APPLICATIONS.filter(a => a.id === id)[0];
    return of(app);
  }
}
