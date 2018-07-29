import { Component, Input } from '@angular/core';

@Component({
  selector: 'tim-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

  @Input()
  public alternative: boolean;
}
