import {
  Component, Inject,
  ViewChild, ViewContainerRef,
  ComponentFactoryResolver,
  Injector, AfterViewInit, ChangeDetectorRef, Input, Optional
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { JobInstance } from '../job-instance';
import { JobStatus, CURRENT_JOB } from '../jobs.model';

@Component({
  selector: 'tim-job-logs',
  templateUrl: './job-logs.component.html',
  styleUrls: ['./job-logs.component.scss']
})
export class JobLogsComponent implements AfterViewInit {

  public readonly JobStatus = JobStatus;

  @ViewChild('detailsTemplate', { read: ViewContainerRef })
  public detailsTemplate: ViewContainerRef;

  @Input()
  public job: JobInstance<any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetection: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    @Optional()
    dialogJob: JobInstance<any>
  ) {

    if (dialogJob) {
      this.job = dialogJob;
    }
  }

  public ngAfterViewInit() {
    const config = this.job.configuration;
    if (config.logsComponent) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(config.logsComponent);

      const injector = Injector.create([
        {
          provide: CURRENT_JOB,
          useValue: this.job
        }
      ], this.detailsTemplate.parentInjector);

      this.detailsTemplate.createComponent(componentFactory, null, injector);
      this.changeDetection.detectChanges();
    }
  }

}
