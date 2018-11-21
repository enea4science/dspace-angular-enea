import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { SubmissionState } from '../../submission/submission.reducers';
import { AuthService } from '../../core/auth/auth.service';
import { MyDSpaceResult } from '../my-dspace-result.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { UploaderOptions } from '../../shared/uploader/uploader-options.model';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { Router } from '@angular/router';
import { NotificationType } from '../../shared/notifications/models/notification-type';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

@Component({
  selector: 'ds-my-dspace-new-submission',
  styleUrls: ['./my-dspace-new-submission.component.scss'],
  templateUrl: './my-dspace-new-submission.component.html'
})

export class MyDSpaceNewSubmissionComponent implements OnInit {
  @Output() uploadEnd = new EventEmitter<Array<MyDSpaceResult<DSpaceObject>>>();

  public findByHref: string;
  public uploadFilesOptions: UploaderOptions = {
    url: '',
    authToken: null,
    disableMultipart: false,
    itemAlias: null
  };

  constructor(@Inject(GLOBAL_CONFIG) public config: GlobalConfig,
              private authService: AuthService,
              private changeDetectorRef: ChangeDetectorRef,
              private halService: HALEndpointService,
              private notificationsService: NotificationsService,
              private router: Router,
              private store: Store<SubmissionState>,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.halService.getEndpoint('workspaceitems').subscribe((url) => {
        this.uploadFilesOptions.url = url;
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
        this.changeDetectorRef.detectChanges();
      }
    );
    this.findByHref = this.config.auth.target.host + '/submit';
  }

  onBeforeUpload = () => {
    // Nothing
  };

  public onCompleteItem(res) {
    if (res && res._embedded && res._embedded.workspaceitems && res._embedded.workspaceitems.length > 0) {
      const workspaceitems = res._embedded.workspaceitems;
      this.uploadEnd.emit(workspaceitems);

      if (workspaceitems.length === 1) {
        const options = new NotificationOptions();
        options.timeOut = 0;
        const link = '/workspaceitems/' + workspaceitems[0].id + '/edit';
        this.notificationsService.notificationWithAnchor(
          NotificationType.Success,
          options,
          link,
          'mydspace.general.text-here',
          'mydspace.upload.upload-successful',
          'here');
      } else if (workspaceitems.length > 1) {
        this.notificationsService.success(null, this.translate.get('mydspace.upload.upload-multiple-successful', {qty: workspaceitems.length}));
      }

    } else {
      this.notificationsService.error(null, this.translate.get('mydspace.upload.upload-failed'));
    }
  }

  public onUploadError() {
    this.notificationsService.error(null, this.translate.get('mydspace.upload.upload-failed'));
  }
}
