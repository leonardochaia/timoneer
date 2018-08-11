import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { SettingsService } from '../../settings/settings.service';
import { TAB_DATA } from '../../tabs/tab.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tim-registry-list-container',
  templateUrl: './registry-list-container.component.html',
  styleUrls: ['./registry-list-container.component.scss']
})
export class RegistryListContainerComponent implements OnInit, OnDestroy {

  public registryUrl: string;

  private componetDestroyed = new Subject();

  constructor(
    @Inject(TAB_DATA)
    public registryName: string,
    private settingsService: SettingsService) { }

  public ngOnInit() {
    this.settingsService.getRegistrySettingsForName(this.registryName)
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(settings => {
        this.registryUrl = settings.url;
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }
}
