import { Injectable } from '@angular/core';
import { Application } from './application.model';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { ElectronService } from '../electron-tools/electron.service';
import { map } from 'rxjs/operators';

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'nginx',
    title: 'NGINX',
    image: 'nginx:alpine',
    description: 'Awesome NGINX Proxy!',
    ports: [
      {
        containerPort: 80,
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

const APPLICATIONS_KEY = 'app-templates';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private get electronSettings() {
    return this.electron.electronSettings;
  }

  protected applicationsSubject = new BehaviorSubject<Application[]>(INITIAL_APPLICATIONS);

  constructor(private electron: ElectronService) {
    this.loadApplications();
  }

  public getApplications() {
    return this.applicationsSubject.asObservable();
  }

  public getApplication(id: string) {
    return this.applicationsSubject.asObservable()
      .pipe(map(apps => apps.find(app => app.id === id)));
  }

  public saveApplications(json: string) {

    let apps: Application[];
    try {
      apps = JSON.parse(json);
    } catch (error) {
      return throwError(error);
    }

    this.electronSettings.set(APPLICATIONS_KEY, apps as any);
    this.applicationsSubject.next(apps);
    return of(apps);
  }

  private loadApplications() {
    if (this.electronSettings.has(APPLICATIONS_KEY)) {
      const apps = this.electronSettings.get(APPLICATIONS_KEY) as any as Application[];
      this.applicationsSubject.next(apps);
    }
  }
}
