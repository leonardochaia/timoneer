import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tim-container-create-container',
  templateUrl: './container-create-container.component.html',
  styleUrls: ['./container-create-container.component.scss']
})
export class ContainerCreateContainerComponent implements OnInit {
  public initialImage: string;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute) { }

  public ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      if (params.get('image')) {
        this.initialImage = params.get('image');
      }
    });
  }

  public containerCreated(id: string) {
    this.router.navigate(['/docker/containers/', id, 'attach']);
  }
}
