import { Component, OnInit, ElementRef, ViewChild, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { switchResponseToObservable } from '../switch-response-to-observable';
import { DaemonService } from '../daemon.service';
import { Terminal } from 'xterm';
import { fit } from 'xterm/lib/addons/fit/fit';

@Component({
  selector: 'tim-container-exec',
  templateUrl: './container-exec.component.html',
  styleUrls: ['./container-exec.component.scss']
})
export class ContainerExecComponent implements OnInit, OnDestroy {

  @ViewChild('terminalContainer')
  public terminalContainer: ElementRef;

  public command = 'ls';

  @Input()
  public containerId: string;

  private term: Terminal;

  private componetDestroyed = new Subject();

  constructor(private daemonService: DaemonService) { }

  public ngOnInit() {
    this.term = new Terminal({
      cursorBlink: false,
    });
    this.term.open(this.terminalContainer.nativeElement);
    this.term.focus();
    fit(this.term);
    this.exec();
  }

  public exec() {
    this.term.clear();
    const command = ['bin/sh', '-c', this.command];
    this.daemonService.execApi(api => api.containerExec({
      AttachStdin: false,
      AttachStderr: true,
      AttachStdout: true,
      Tty: true,
      Cmd: command,
    }, this.containerId))
      .pipe(
        takeUntil(this.componetDestroyed),
        switchMap(withId => {
          this.term.writeln(`Executing exec [${withId.Id}]`);
          this.term.writeln(`# ${this.command}`);
          return this.daemonService.execApi(api => api.execStart(withId.Id));
        }),
        switchResponseToObservable<string>(),
    )
      .subscribe((line) => {
        this.term.writeln(line);
      }, (error) => {
        this.term.writeln(`HTTP ${error.status}`);
        this.term.writeln(error.message);
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
