import { Component, OnInit, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'tim-application-edit-external-source',
  templateUrl: './application-edit-external-source.component.html',
  styleUrls: ['./application-edit-external-source.component.scss']
})
export class ApplicationEditExternalSourceComponent implements OnInit {

  @Input()
  public sources: FormArray;

  public ngOnInit() {
  }

  public removeSource(index: number) {
    this.sources.removeAt(index);
  }

}
