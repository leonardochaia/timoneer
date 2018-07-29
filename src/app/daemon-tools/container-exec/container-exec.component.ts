import { Component, OnInit, ElementRef, ViewChild, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
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

  @Input()
  public containerId: string;

  public connected: boolean;

  public loading: boolean;

  public error: string;

  private terminal: Terminal;

  private componetDestroyed = new Subject();

  constructor(private daemonService: DaemonService) { }

  public ngOnInit() {

    this.loading = true;

    this.setupTerminal();
    this.daemonService.exec(this.containerId)
      .subscribe((socket) => {
        this.connected = true;
        this.loading = false;

        this.daemonService.streamToObservable(socket)
          .subscribe(line => {
            this.terminal.write(line.toString());
          }, e => {
            console.error(e);
          }, () => {
            this.connected = false;
          });

        this.terminal.on('key', key => {
          socket.write(key);
        });

      }, e => {
        this.error = e.message;
        this.connected = false;
        this.loading = false;
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
      cursorBlink: false,
    });
    this.terminal.open(this.terminalContainer.nativeElement);
    this.terminal.focus();
    fit(this.terminal);
  }
}
