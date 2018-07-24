import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../application.service';
import { Application } from '../application.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tim-application-launch-container',
  templateUrl: './application-launch-container.component.html',
  styleUrls: ['./application-launch-container.component.scss']
})
export class ApplicationLaunchContainerComponent implements OnInit, OnDestroy {
  public application: Application;

  private componetDestroyed = new Subject();

  constructor(private route: ActivatedRoute,
    private applicationService: ApplicationService) { }

  public ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const appId = params.get('appId');
      this.applicationService.getApplication(appId)
        .pipe(takeUntil(this.componetDestroyed))
        .subscribe(app => {
          this.application = app;
        });
    });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
