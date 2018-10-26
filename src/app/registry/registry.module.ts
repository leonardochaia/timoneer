import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule, MatCardModule, MatButtonModule } from '@angular/material';
import { SettingsModule } from '../settings/settings.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { ImageSourceMultiple } from '../docker-images/image-source.model';
import { RegistryImageSourceMultiple } from './registry.image-source';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,

    SharedModule,
    SettingsModule,
  ],
  providers: [
    {
      provide: ImageSourceMultiple,
      useClass: RegistryImageSourceMultiple,
      multi: true,
    }
  ],
  declarations: [
  ],
  exports: [
  ],
})
export class RegistryModule { }
