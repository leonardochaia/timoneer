import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { JobInstance } from './job-instance';
import { JobDefinition } from './job-definition';
import { JobLogsComponent } from './job-logs/job-logs.component';

@Injectable({
  providedIn: 'root'
})
export class JobDetailsService {

  constructor(private matDialog: MatDialog) { }

  public openDetailsModal<TJobDef extends JobDefinition<TResult>, TResult>(job: JobInstance<TJobDef, TResult>) {
    this.matDialog.open(JobLogsComponent, {
      data: job
    });
  }
}
