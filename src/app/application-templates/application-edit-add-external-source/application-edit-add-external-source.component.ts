import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'tim-application-edit-add-external-source',
  templateUrl: './application-edit-add-external-source.component.html',
  styleUrls: ['./application-edit-add-external-source.component.scss']
})
export class ApplicationEditAddExternalSourceComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public sourceFormGroup: FormGroup) { }

  public ngOnInit() {
  }

}
