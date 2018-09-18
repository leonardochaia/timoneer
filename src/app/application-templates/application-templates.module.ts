import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationListComponent } from './application-list/application-list.component';
import { MatIconModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatDialogModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ApplicationListContainerComponent } from './application-list-container/application-list-container.component';
import { ApplicationLaunchContainerComponent } from './application-launch-container/application-launch-container.component';
import { ApplicationLaunchComponent } from './application-launch/application-launch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistryModule } from '../registry/registry.module';
import { DaemonToolsModule } from '../daemon-tools/daemon-tools.module';
import { ApplicationEditListContainerComponent } from './application-edit-list-container/application-edit-list-container.component';
import { ApplicationEditExternalSourceComponent } from './application-edit-external-source/application-edit-external-source.component';
import {
  ApplicationEditAddExternalSourceComponent
} from './application-edit-add-external-source/application-edit-add-external-source.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,

    RegistryModule,

    DaemonToolsModule,
  ],
  declarations: [
    ApplicationListComponent,
    ApplicationListContainerComponent,
    ApplicationLaunchContainerComponent,
    ApplicationLaunchComponent,
    ApplicationEditListContainerComponent,
    ApplicationEditExternalSourceComponent,
    ApplicationEditAddExternalSourceComponent,
  ],
  entryComponents: [
    ApplicationEditAddExternalSourceComponent,
  ],
  exports: [
    ApplicationListComponent,
    ApplicationListContainerComponent,
  ]
})
export class ApplicationTemplatesModule { }
