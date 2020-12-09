import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ProcessParameter } from '../../../process-page/processes/process-parameter.model';
import { RequestEntry } from '../../../core/data/request.reducer';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { RequestService } from '../../../core/data/request.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-export-item',
  templateUrl: './export-collection-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.COLLECTION)
export class ExportCollectionMenuComponent extends ContextMenuEntryComponent {

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {EditItemDataService} editItemService
   * @param {modalService} modalService
   * @param {NotificationsService} notificationsService
   * @param {RequestService} requestService
   * @param {Router} router
   * @param {ScriptDataService} scriptService
   * @param {TranslateService} translationService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private authorizationService: AuthorizationDataService,
    private editItemService: EditItemDataService,
    private modalService: NgbModal,
    private notificationsService: NotificationsService,
    private requestService: RequestService,
    private router: Router,
    private scriptService: ScriptDataService,
    private translationService: TranslateService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType);
  }

  /**
   * Launch a process to export collection
   */
  exportCollection() {
    const stringParameters: ProcessParameter[] = [
      { name: '-c', value: this.contextMenuObject.id }
    ];

    this.scriptService.invoke('collection-export', stringParameters, [])
      .pipe(take(1))
      .subscribe((requestEntry: RequestEntry) => {
        if (requestEntry.response.isSuccessful) {
          this.notificationsService.success(this.translationService.get('collection-export.success'));
          this.navigateToProcesses();
        } else {
          this.notificationsService.error(this.translationService.get('collection-export.error'));
        }
      })
  }

  /**
   * Check if user is administrator for this collection
   */
  isCollectionAdmin(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, this.contextMenuObject.self, undefined);
  }

  /**
   * Redirect to process list page
   */
  private navigateToProcesses() {
    this.requestService.removeByHrefSubstring('/processes');
    this.router.navigateByUrl('/processes');
  }
}
