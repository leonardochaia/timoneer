import { NgModule, ModuleWithProviders, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { MatTabsModule, MatIconModule, MatButtonModule } from '@angular/material';
import { TabHistoryService } from './tab-history.service';
import { TabStorageService } from './tab-storage.service';
import { TabService } from './tab.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ElectronToolsModule } from '../electron-tools/electron-tools.module';
import { APPLICATION_TABS, TabConfiguration } from './tab.model';

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
  exports: [
    TabsContainerComponent,
  ]
})
export class TabsModule {

  constructor(tabStorageService: TabStorageService,
    tabHistoryService: TabHistoryService) {

    tabStorageService.initialize();
    tabHistoryService.initialize();
  }

  public static forRoot(config: TabConfiguration[]): ModuleWithProviders {
    return {
      ngModule: TabsModule,
      providers: [
        {
          // This does magic and finds all component in the config.
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: config,
          multi: true
        },
        {
          provide: APPLICATION_TABS,
          useValue: config
        },
        TabService,
        TabStorageService,
        TabHistoryService,
      ]
    };
  }
}
