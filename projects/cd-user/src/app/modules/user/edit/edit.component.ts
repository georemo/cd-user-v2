import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AclService, IQuery, SessService,
  NotificationService, CdPushEnvelop, BaseModel, BaseService, DEFAULT_PUSH_RECEPIENTS
} from '@corpdesk/core';
import { PageService } from '@corpdesk/naz';
import { USER_STEP_MODEL } from '../user.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  baseModel: BaseModel;
  formConfig: any = {};
  updateQuery: IQuery;

  constructor(
    private aRoute: ActivatedRoute,
    public router: Router, // do not remove, used by libraries to navigate
    private svBase: BaseService,
    private svPage: PageService,
    public svSess: SessService,
    private svAcl: AclService,
    private svNotif: NotificationService,
  ) {
    this.init();
  }

  ngOnInit() {
    this.aRoute.queryParams
      .subscribe(params => {
        this.svAcl.initComponent(params, this, this.svSess).then((ret) => {
        });
      });
  }

  init() {
    this.baseModel = new BaseModel(USER_STEP_MODEL.module, USER_STEP_MODEL.controller);
    this.baseModel.breadCrumbItems = this.svPage.setBreadCrumbs(USER_STEP_MODEL.controller, 'Edit')
    this.baseModel.data.subTitle = 'only allowed fields are editable';
  }

  async update(updateQuery: any) {
    this.svBase.update$(updateQuery, this.baseModel.token)
      .subscribe((res: any) => {
        const pushEnvelop: CdPushEnvelop = {
          pushRecepients: DEFAULT_PUSH_RECEPIENTS,
          pushData: res,
          emittEvent: 'push-notif',
          triggerEvent: 'send-notif',
          req: null,
          resp: res
        };
        this.svNotif.emitNotif(pushEnvelop);
      })
  }
}
