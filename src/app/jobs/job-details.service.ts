import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { JobInstance } from './job-instance';
import { JobDetailsWrapperComponent } from './job-details-wrapper/job-details-wrapper.component';
import { JobDefinition } from './job-definition';

@Injectable({
  providedIn: 'root'
})
export class JobDetailsService {

  constructor(private matDialog: MatDialog) { }

  public openDetailsModal<TJobDef extends JobDefinition<TResult>, TResult>(job: JobInstance<TJobDef, TResult>) {
    this.matDialog.open(JobDetailsWrapperComponent, {
      data: job
    });
  }
}
