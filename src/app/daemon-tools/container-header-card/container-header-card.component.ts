import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tim-container-header-card',
  templateUrl: './container-header-card.component.html',
  styleUrls: ['./container-header-card.component.scss']
})
export class ContainerHeaderCardComponent {

  @Input()
  public containerId: string;

  @Input()
  public containerName: string;

  @Input()
  public containerState: string;

  @Input()
  public imageName: string;

  @Input()
  public hiddenButtons: string[];

  constructor() { }

  public getImageName() {
    if (this.imageName.startsWith('sha256:')) {
      return this.imageName.replace('sha256:', '').slice(0, 12);
    } else {
      return this.imageName;
    }
  }

}
