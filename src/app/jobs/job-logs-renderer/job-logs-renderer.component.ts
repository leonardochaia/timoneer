import {
  Component, Input,
  ViewContainerRef, ViewChild,
  ComponentFactoryResolver,
  ChangeDetectorRef, Injector,
  AfterViewInit
} from '@angular/core';
import { CURRENT_JOB } from '../jobs.model';
import { JobInstance } from '../job-instance';

@Component({
  selector: 'tim-job-logs-renderer',
  templateUrl: './job-logs-renderer.component.html',
  styleUrls: ['./job-logs-renderer.component.scss']
})
export class JobLogsRendererComponent implements AfterViewInit {

  @ViewChild('customLogsTemplate', { read: ViewContainerRef })
  public detailsTemplate: ViewContainerRef;

  @Input()
  public job: JobInstance;

  public usingCustomDetails = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetection: ChangeDetectorRef) {
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
      this.usingCustomDetails = true;
      this.changeDetection.detectChanges();
    }
  }
}
