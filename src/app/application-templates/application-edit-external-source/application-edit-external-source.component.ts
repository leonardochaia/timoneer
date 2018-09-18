import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import {
  ApplicationEditAddExternalSourceComponent
} from '../application-edit-add-external-source/application-edit-add-external-source.component';

@Component({
  selector: 'tim-application-edit-external-source',
  templateUrl: './application-edit-external-source.component.html',
  styleUrls: ['./application-edit-external-source.component.scss']
})
export class ApplicationEditExternalSourceComponent implements OnInit {

  @Input()
  public sources: FormArray;

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog) { }

  public ngOnInit() {
  }

  public addSource() {
    const source = this.fb.group({
      url: ['http://', Validators.compose([Validators.required, Validators.pattern('(http|https)://.+')])],
    });

    this.matDialog.open(ApplicationEditAddExternalSourceComponent, {
      data: source,
    }).afterClosed()
      .subscribe(newGroup => {
        if (newGroup) {
          this.sources.push(newGroup);
        }
      });
  }

  public removeSource(index: number) {
    this.sources.removeAt(index);
  }

}
