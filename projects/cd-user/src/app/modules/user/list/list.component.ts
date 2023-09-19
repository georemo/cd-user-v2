import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  AclService, DdlData, FieldType, IQuery,
  TDS, TPD, DsEmittData,  DEFAULT_TPD, BaseModel, BaseService, SessService
 } from '@corpdesk/core';
import { NazTableComponent, NazTableService, PageService } from '@corpdesk/naz';
import { UserModel, USER_STEP_MODEL, DEFAULT_DDLD } from '../user.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  baseModel: BaseModel;
  dSource: TDS = { fields: [], data: [] };
  cardTitle = 'User';
  cardBodyId = 'user';
  searchInputId = 'inputSearchUser';
  filter = {};
  @ViewChild(NazTableComponent) nazTable: NazTableComponent;
  dsEmittData: DsEmittData;
  sQuery: IQuery;
  tpData: TPD = DEFAULT_TPD;
  ddlData: DdlData[] = DEFAULT_DDLD;

  constructor(
    private aRoute: ActivatedRoute,
    public router: Router, // do not remove, used by libraries to navigate
    private svBase: BaseService,
    private svNazTable: NazTableService,
    private svAcl: AclService,
    private svPage: PageService,
    private svSess: SessService,
  ) {
    this.init();
  }

  ngOnInit(): void {
    this.aRoute.queryParams
      .subscribe(params => {
        if (params) {
          this.svAcl.initComponent(params, this, this.svSess).then((ret) => {
          });
        }
      });
  }

  init() {
    this.baseModel = new BaseModel(USER_STEP_MODEL.module, USER_STEP_MODEL.controller);
    this.svBase.module = USER_STEP_MODEL.module;
    this.svBase.controller = USER_STEP_MODEL.controller;
    this.baseModel.data.fields = UserModel.filter(f => f.fetchable || f.type === FieldType.action)
    this.baseModel.breadCrumbItems = this.svPage.setBreadCrumbs(USER_STEP_MODEL.controller, 'List')
    this.sQuery = this.svNazTable.initSQuery(this);
    this.dsEmittData = this.svNazTable.initEmittData(this);
  }

  execQuery(dsEmittData: DsEmittData) {
    this.svNazTable.execQuery(dsEmittData,this.svBase.getPaged$(this.sQuery, this.baseModel.sess.cd_token!),this)
  }

  setSearchQuery(dsEmittData: DsEmittData) {
    this.sQuery = dsEmittData.sQuery;
    this.execQuery(dsEmittData)
  }

  getSelect() {
    return this.baseModel.data.fields.filter(f => f.fetchable).map(f => f.name)
  }

}
