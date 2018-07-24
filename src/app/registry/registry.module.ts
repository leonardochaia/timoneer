import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RegistryListComponent } from './registry-list/registry-list.component';
import { MatIconModule, MatCardModule, MatButtonModule } from '@angular/material';
import { SettingsModule } from '../settings/settings.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { RegistryListContainerComponent } from './registry-list-container/registry-list-container.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,

    SharedModule,
    SettingsModule,
  ],
  declarations: [
    RegistryListComponent,
    RegistryListContainerComponent
  ],
  exports: [
    RegistryListComponent
  ]
})
export class RegistryModule { }
