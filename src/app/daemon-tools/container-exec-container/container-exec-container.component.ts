import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tim-container-exec-container',
  templateUrl: './container-exec-container.component.html',
  styleUrls: ['./container-exec-container.component.scss']
})
export class ContainerExecContainerComponent implements OnInit, OnDestroy {

  public containerId: string;

  private componetDestroyed = new Subject();

  constructor(private activatedRoute: ActivatedRoute) { }

  public ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(map => {
        this.containerId = map.get('containerId');
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
