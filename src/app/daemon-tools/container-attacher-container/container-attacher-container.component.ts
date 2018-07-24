import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tim-container-attacher-container',
  templateUrl: './container-attacher-container.component.html',
  styleUrls: ['./container-attacher-container.component.scss']
})
export class ContainerAttacherContainerComponent implements OnInit, OnDestroy {

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
