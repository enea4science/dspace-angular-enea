import { Component, Input } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';

import { SortOptions } from '../../core/cache/models/sort-options.model';

import { MyDSpaceResult } from '../my-dspace-result.model';
import { SearchOptions, ViewMode } from '../../+search-page/search-options.model';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-my-dspace-results',
  templateUrl: './my-dspace-results.component.html',
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class MyDSpaceResultsComponent {
  @Input() searchResults: RemoteData<Array<MyDSpaceResult<DSpaceObject>>>;
  @Input() searchConfig: SearchOptions;
  @Input() sortConfig: SortOptions;
  @Input() viewMode: ViewMode;
}
