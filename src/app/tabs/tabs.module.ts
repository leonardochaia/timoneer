import { NgModule, ModuleWithProviders, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { MatTabsModule, MatIconModule, MatButtonModule } from '@angular/material';
import { TabHistoryService } from './tab-history.service';
import { TabStorageService } from './tab-storage.service';
import { TabService } from './tab.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ElectronToolsModule } from '../electron-tools/electron-tools.module';
import { ITimoneerTab, APPLICATION_TABS } from './tab.model';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,

    ElectronToolsModule,
  ],
  declarations: [
    TabsContainerComponent,
  ],
  providers: [
    TabService,
    TabStorageService,
    TabHistoryService,
  ],
  exports: [
    TabsContainerComponent,
  ]
})
export class TabsModule {

  public static forRoot(config: ITimoneerTab[]): ModuleWithProviders {
    return {
      ngModule: TabsModule,
      providers: [
        ...config.map(c => ({
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: c.component,
          multi: true
        })),
        {
          provide: APPLICATION_TABS,
          useValue: config
        }
      ]
    };
  }
}
