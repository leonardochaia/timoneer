import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Terminal } from 'xterm';
import { attach } from 'xterm/lib/addons/attach/attach';
import { fit } from 'xterm/lib/addons/fit/fit';
import { SettingsService } from '../../settings/settings.service';
import { Subject } from 'rxjs';
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
  public error: string;

  private componetDestroyed = new Subject();

  public get connected() {
    return this.socket.readyState === WebSocket.OPEN;
  }

  constructor(private settingsService: SettingsService) {
  }

  public ngOnInit() {

    this.attaching = true;
    this.settingsService.getSettings()
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(settings => {
        const wss = settings.dockerClientSettings.url.replace('http://', 'ws://')
          + `/containers/${this.containerId}/attach/ws?logs=true&stream=true&stdin=true&stdout=true&stderr=true`;

        this.socket = new WebSocket(wss);
        this.socket.binaryType = 'arraybuffer';

        this.socket.onerror = (error) => {
          console.error(error);
          this.attaching = false;
          this.error = 'An error has ocurred!';
        };

        this.socket.onopen = () => {
          this.attaching = false;
          const term = new Terminal({
            cursorBlink: true,
          });
          term.open(this.terminalContainer.nativeElement);
          term.focus();
          fit(term);
          attach(term, this.socket, true, true);
        };

        this.socket.onclose = () => {
          this.attaching = false;
        };

      });

  }

  public ngOnDestroy() {
    if (this.socket) {
      this.socket.close();
    }
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

}
