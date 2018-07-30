import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { EventEmitter } from 'stream';
import { DaemonService } from '../daemon.service';
import { Exec } from 'dockerode';
import { TLSSocket } from 'tls';

@Component({
  selector: 'tim-container-exec-container',
  templateUrl: './container-exec-container.component.html',
  styleUrls: ['./container-exec-container.component.scss']
})
export class ContainerExecContainerComponent implements OnInit, OnDestroy {

  public containerId: string;

  public stream$: Observable<EventEmitter>;

  public get execId() {
    return this.exec && this.exec.id;
  }

  private componetDestroyed = new Subject();

  private exec: Exec;

  constructor(private activatedRoute: ActivatedRoute,
    private daemonService: DaemonService) { }

  public ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        map(m => m.get('containerId')),
        takeUntil(this.componetDestroyed)
      )
      .subscribe(containerId => {
        this.containerId = containerId;

        this.stream$ = this.daemonService.docker(d => d.getContainer(containerId).exec({
          Cmd: ['bin/sh'],
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          Tty: true,
        }))
          .pipe(
            map(exec => this.exec = exec),
            switchMap((exec: Exec) => from(exec.start({
              hijack: true,
            }))),
            map(socket => socket.output as TLSSocket)
          );
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
