import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'tim-registry-list-container',
  templateUrl: './registry-list-container.component.html',
  styleUrls: ['./registry-list-container.component.scss']
})
export class RegistryListContainerComponent implements OnInit, OnDestroy {

  public registryUrl: string;

  private componetDestroyed = new Subject();

  public registryName: string;

  constructor(private activatedRoute: ActivatedRoute,
    private settingsService: SettingsService) { }

  public ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.componetDestroyed))
      .subscribe(map => {
        this.settingsService.getRegistrySettingsForName(map.get('registryName'))
          .subscribe(settings => {
            this.registryName = this.settingsService.getRegistryName(settings);
            this.registryUrl = settings.url;
          });
      });
  }

  public ngOnDestroy() {
    this.componetDestroyed.next();
    this.componetDestroyed.unsubscribe();
  }

}
