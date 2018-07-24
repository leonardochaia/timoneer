import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeContainerComponent } from './home-container/home-container.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { RegistryModule } from '../registry/registry.module';
import { MatButtonModule, MatIconModule, MatCardModule } from '@angular/material';
import { ApplicationTemplatesModule } from '../application-templates/application-templates.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,

    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,

    RegistryModule,
    ApplicationTemplatesModule,
  ],
  declarations: [HomeContainerComponent]
})
export class HomeModule { }
