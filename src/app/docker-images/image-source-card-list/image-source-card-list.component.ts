import { Component, OnInit, Input } from '@angular/core';
import { ImageSourceService } from '../image-source.service';
import { ImageSourceAuthenticated, ImageSource } from '../image-source.model';
import { TimoneerTabs } from '../../timoneer-tabs';
import { TabService } from '../../tabs/tab.service';

@Component({
  selector: 'tim-image-source-card-list',
  templateUrl: './image-source-card-list.component.html',
  styleUrls: ['./image-source-card-list.component.scss']
})
export class ImageSourceCardListComponent implements OnInit {

  @Input()
  public minPriority?: number;

  public sources: (ImageSource & Partial<ImageSourceAuthenticated>)[];

  constructor(
    private readonly imageSource: ImageSourceService,
    private readonly tab: TabService) { }

  public ngOnInit() {
    this.imageSource.sources
      .subscribe(sources => {
        if (typeof this.minPriority === 'number') {
          this.sources = sources.filter(s => s.priority > this.minPriority);
        } else {
          this.sources = sources;
        }
      });
  }

  public openImageList(source: ImageSource) {
    this.tab.add(TimoneerTabs.DOCKER_IMAGES, {
      params: {
        name: source.name
      }
    });
  }
}
