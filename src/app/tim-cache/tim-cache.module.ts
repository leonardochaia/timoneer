import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimCacheService } from './tim-cache.service';
import { TimCacheStoreService } from './tim-cache-store.service';
import { TimIndexedDBCacheStore } from './tim-indexeddb-cache-store';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TimCacheService,
  ],
  declarations: [],
})
export class TimCacheModule {
  public static forRoot(storeType?: Type<TimCacheStoreService>): ModuleWithProviders {
    return {
      ngModule: TimCacheModule,
      providers: [
        {
          provide: TimCacheStoreService,
          useClass: storeType || TimIndexedDBCacheStore,
        },
      ]
    };
  }
}
