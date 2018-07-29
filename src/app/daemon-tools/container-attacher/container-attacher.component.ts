import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Terminal } from 'xterm';
import { fit } from 'xterm/lib/addons/fit/fit';
import { Subject } from 'rxjs';
import { DaemonService } from '../daemon.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tim-container-attacher',
  templateUrl: './container-attacher.component.html',
  styleUrls: ['./container-attacher.component.scss']
})
export class ContainerAttacherComponent implements OnInit, OnDestroy {

  @Input()
  public containerId: string;

  @ViewChild('terminalContainer')
  public terminalContainer: ElementRef;
  public socket: WebSocket;

  public attaching: boolean;
  public connected: boolean;
  public error: string;

  private componetDestroyed = new Subject();
  private terminal: Terminal;

  constructor(private daemonService: DaemonService) { }

  public ngOnInit() {

    this.connected = false;
    this.attaching = true;

    this.daemonService.docker(d => d.getContainer(this.containerId).attach({
      stream: true,
      hijack: true,
      stdin: true,
      stdout: true,
      stderr: true,
      logs: true
    }))
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(str => {
        const stream = <any>str as NodeJS.WritableStream;
        this.connected = true;
        this.attaching = false;

        this.setupTerminal();

        this.daemonService.streamToObservable(str)
          .subscribe(line => {
            this.terminal.write(line.toString());
          }, e => {
            console.error(e);
          }, () => {
            this.connected = false;
          });

        this.terminal.on('key', k => {
          stream.write(k);
        });

      }, e => {
        this.error = e.message;
        this.attaching = false;
        this.connected = false;
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
    if (this.terminal) {
      this.terminal.dispose();
    }
  }

  private setupTerminal() {
    this.terminal = new Terminal({
      cursorBlink: true,
    });
    this.terminal.open(this.terminalContainer.nativeElement);
    this.terminal.focus();
    fit(this.terminal);
  }
}
