import { Injectable } from '@angular/core';
import { Application } from './application.model';
import { of, BehaviorSubject, throwError, forkJoin } from 'rxjs';
import { ElectronService } from '../electron-tools/electron.service';
import { map, switchMap, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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

interface ApplicationConfig {
  localTemplates: Application[];
  externalSources: { url: string }[];
}

const INITIAL_CONFIG: ApplicationConfig = {
  externalSources: [],
  localTemplates: INITIAL_APPLICATIONS
};

const CONFIG_KEY = 'app-templates';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private get electronSettings() {
    return this.electron.electronSettings;
  }

  protected configSubject = new BehaviorSubject<ApplicationConfig>(INITIAL_CONFIG);
  protected applicationsSubject = new BehaviorSubject<Application[]>(this.configSubject.value.localTemplates);

  constructor(private electron: ElectronService,
    private httpClient: HttpClient) {
    this.loadConfiguration();
    this.reloadExternalSources();
  }

  public getApplications() {
    return this.applicationsSubject.asObservable();
  }

  public getApplication(id: string) {
    return this.getApplications()
      .pipe(map(apps => apps.find(app => app.id === id)));
  }

  public getConfig() {
    return this.configSubject.asObservable();
  }

  public saveApplications(config: ApplicationConfig) {
    this.electronSettings.set(CONFIG_KEY, config as any);
    this.loadConfiguration();
    return of(config);
  }

  public reloadExternalSources() {
    this.loadExternalSources()
      .subscribe(externalApps => {
        const existant = this.configSubject.value.localTemplates.slice();
        for (const template of externalApps) {
          if (existant.some(t => t.id === template.id)) {
            continue;
          }
          existant.push(template);
        }
        this.applicationsSubject.next(existant);
      });
  }

  private loadExternalSources() {
    return this.configSubject
      .pipe(
        map(config => config.externalSources),
        switchMap(sources => sources.length ? forkJoin(sources.map(s => this.httpClient.get<Application[]>(s.url))) : of([[]])),
        map(arrays => [].concat.apply([], arrays) as Application[]),
      );
  }

  private loadConfiguration() {
    if (this.electronSettings.has(CONFIG_KEY)) {
      const config = this.electronSettings.get(CONFIG_KEY) as any as ApplicationConfig;
      this.configSubject.next(config);
    }
  }
}
