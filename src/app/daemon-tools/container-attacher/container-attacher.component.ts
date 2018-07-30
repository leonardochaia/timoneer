import { Component, Input, ElementRef, ViewChild, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Terminal } from 'xterm';
import { fit } from 'xterm/lib/addons/fit/fit';
import { Subject, Observable } from 'rxjs';
import { DaemonService } from '../daemon.service';
import { takeUntil, map } from 'rxjs/operators';
import { EventEmitter } from 'stream';

@Component({
  selector: 'tim-container-attacher',
  templateUrl: './container-attacher.component.html',
  styleUrls: ['./container-attacher.component.scss']
})
export class ContainerAttacherComponent implements OnChanges, OnDestroy {

  @Input()
  public containerId: string;

  @Input()
  public stream: Observable<EventEmitter>;

  @ViewChild('terminalContainer')
  public terminalContainer: ElementRef;

  public attaching: boolean;
  public connected: boolean;
  public error: string;

  private componetDestroyed = new Subject();
  private terminal: Terminal;

  constructor(private daemonService: DaemonService) { }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['stream']) {
      if (this.stream) {
        this.attaching = true;
        this.stream
          .pipe(takeUntil(this.componetDestroyed))
          .pipe(takeUntil(this.componetDestroyed))
          .subscribe(str => {
            this.connected = true;
            this.attaching = false;

            this.setupTerminal();

            this.daemonService.streamToObservable<Buffer>(str)
              .pipe(
                map(chunk => chunk.toString()),
            )
              .subscribe(chunk => {
                this.terminal.write(chunk);
              }, null, () => {
                this.connected = false;
              });

            const writeable = str as NodeJS.WritableStream;
            this.terminal.on('key', k => {
              if (writeable.writable) {
                writeable.write(k);
              } else {
                console.warn('Attempted to write to non writeable stream');
              }
            });

          }, e => {
            this.error = e.message;
            this.attaching = false;
            this.connected = false;
          });

      } else {
        this.connected = false;
        this.attaching = true;
      }
    }
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
      allowTransparency: true,
      theme: {
        background: 'rgba(0,0,0, 0.3)',
      }
    });
    this.terminal.open(this.terminalContainer.nativeElement);
    this.terminal.focus();
    fit(this.terminal);
  }
}
