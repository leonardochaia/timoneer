import {
  Component, Inject,
  ViewChild, ViewContainerRef,
  ComponentFactoryResolver,
  Injector, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { JobInstance } from '../job-instance';
import { JobStatus, JOB_DETAILS_JOB } from '../jobs.model';

@Component({
  selector: 'tim-job-details-wrapper',
  templateUrl: './job-details-wrapper.component.html',
  styleUrls: ['./job-details-wrapper.component.scss']
})
export class JobDetailsWrapperComponent implements AfterViewInit {

  public readonly JobStatus = JobStatus;

  @ViewChild('detailsTemplate', { read: ViewContainerRef })
  public detailsTemplate: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetection: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public readonly job: JobInstance<any>
  ) { }

  public ngAfterViewInit() {
    const config = this.job.configuration;
    if (config.detailsComponent) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(config.detailsComponent);

      const injector = Injector.create([
        {
          provide: JOB_DETAILS_JOB,
          useValue: this.job
        }
      ], this.detailsTemplate.parentInjector);

      this.detailsTemplate.createComponent(componentFactory, null, injector);
      this.changeDetection.detectChanges();
    }
  }

}
