import {
  Component, Input, ElementRef,
  ViewChild, OnDestroy, OnChanges,
  SimpleChanges, HostListener,
  EventEmitter, Output
} from '@angular/core';
import { Terminal } from 'xterm';
import { fit } from 'xterm/lib/addons/fit/fit';
import { Subject, Observable } from 'rxjs';
import { DaemonService } from '../daemon.service';
import { takeUntil, map, debounceTime } from 'rxjs/operators';
import { EventEmitter as StreamEventEmitter } from 'stream';
import { streamToObservable } from '../stream-to-observable';

export interface TerminalMeasures {
  pixelWidth: number;
  pixelHeight: number;
  charWidth: number;
  charHeight: number;
}

@Component({
  selector: 'tim-container-attacher',
  templateUrl: './container-attacher.component.html',
  styleUrls: ['./container-attacher.component.scss']
})
export class ContainerAttacherComponent implements OnChanges, OnDestroy {

  @Input()
  public containerId: string;

  @Input()
  public stream: Observable<StreamEventEmitter>;

  @Output()
  public resize = new EventEmitter<TerminalMeasures>();

  @ViewChild('terminalContainer')
  public terminalContainer: ElementRef;

  public attaching: boolean;
  public connected: boolean;
  public error: string;

  private componetDestroyed = new Subject();
  private terminal: Terminal;
  private windowSize = new Subject<{ width: number, height: number }>();

  constructor(private daemonService: DaemonService) {

    this.windowSize.asObservable()
      .pipe(
        debounceTime(500)
      ).subscribe(measures => {
        if (this.terminal) {
          const { charHeight, charWidth } = this.resizeTerminal(measures.width);
          this.resize.emit({
            charHeight: charHeight,
            charWidth: charWidth,
            pixelHeight: measures.height,
            pixelWidth: measures.width
          });
        }
      });
  }

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

            streamToObservable<Buffer>(str)
              .pipe(map(chunk => chunk.toString()))
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

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.windowSize.next({
      width: this.terminalContainer.nativeElement.offsetWidth,
      height: this.terminalContainer.nativeElement.offsetHeight
    });
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
    this.resizeTerminal(this.terminalContainer.nativeElement.offsetWidth);
  }

  private resizeTerminal(width: number) {
    const charHeight = 25;
    const charWidth = Math.floor((width - 20) / 8.39);
    this.terminal.resize(charWidth, charHeight);
    fit(this.terminal);
    return {
      charHeight,
      charWidth
    };
  }
}
