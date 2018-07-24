import { Component, OnInit, Input, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { DockerStreamResponse } from '../docker-client.model';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tim-image-pull-logs',
  templateUrl: './image-pull-logs.component.html',
  styleUrls: ['./image-pull-logs.component.scss']
})
export class ImagePullLogsComponent implements OnInit, OnDestroy {

  @Input()
  public observable: Observable<DockerStreamResponse>;

  public logs: DockerStreamResponse[] = [];

  public connecting: boolean;

  @ViewChild('containerLogs')
  private containerLogsElement: ElementRef;

  private componetDestroyed = new Subject();

  public ngOnInit() {
    this.connecting = true;
    this.observable
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(response => {
        this.connecting = false;

        const cached = !response.id || this.logs.filter(k => k.id === response.id)[0];
        if (!cached) {
          this.logs.push(response);
          this.scrollLogsToBottom();
        } else {
          Object.assign(cached, response);
        }

      }, (e: { message: string }) => {
        this.connecting = false;
        this.logs.push({
          error: e.message,
          progressDetail: null,
        });
      });
  }

  public trackByFn(index, item: DockerStreamResponse) {
    return item.id;
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

  private scrollLogsToBottom() {
    setTimeout(() => {
      const elm = this.containerLogsElement.nativeElement;
      elm.scrollTop = elm.scrollHeight;
    });
  }

}
