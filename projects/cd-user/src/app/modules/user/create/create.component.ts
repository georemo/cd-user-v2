// Test route: http://localhost:4402/moduleman/module/create
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import {
  FormsService, AWizardStep, AclService,NotificationService, 
  FieldFor, EmittedDdlSelection, BaseModel, CdPushService, BaseService, SessService
} from '@corpdesk/core';
import { IUserModel, UserModel, UserWizardModel, DEFAULT_INSERTABLE_USER, USER_STEP_MODEL } from '../user.model';
import { Observable } from 'rxjs';
// import { DEFAULT_INSERTABLE_MODULE, IModuleModel } from '../../module/module.model';
import { PageService } from '@corpdesk/naz';
import { UserFrontService } from '../user-front.service';
// import { UserModService } from '../user-mod.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, AfterViewInit {
  /**
   * baseModel holds common component properties.
   * The properties are initiated by the acl
   * at ngOnInit()
   */
  baseModel: BaseModel;

  /**
   * USER STUFF /////////////////////////////////////////////
   */
  /**
   * used to control input for create
   */
  userStep: AWizardStep;
  /**
   * for initiating new user
   */
  newUser: any = DEFAULT_INSERTABLE_USER;
  /**
  * this property is for holding
  * the menu data from db
  */
  userData: IUserModel[];
  /**
   * access to menu form controls
   */
  wizardModel = UserWizardModel;

  /**
   * FOREIGN CONTROLLER/S /////////////////////////////////////////////
   */
  /**
   * MODULE items
   */
  // newModule = DEFAULT_INSERTABLE_MODULE;
  // moduleStep: AWizardStep;

  /**
   * model items
   */
  // menuData: IModuleModel;

  constructor(
    private aRoute: ActivatedRoute,
    public router: Router, // do not remove, used by libraries to navigate
    // private svUserMod: UserModService,
    private svAcl: AclService,
    public svForm: FormsService,
    private svNotif: NotificationService,
    private fb: FormBuilder,
    private svForms: FormsService,
    // private svModman: ModulemanService,
    private svPage: PageService,
    private svPush: CdPushService,
    private svBase: BaseService,
    private svUserFront: UserFrontService,
    private svSess: SessService,
  ) {
    this.init();
  }

  ngOnInit(): void {
    this.aRoute.queryParams
      .subscribe((params: any) => {
        this.svAcl.initComponent(params, this, this.svSess).then((ret) => {
          if (ret) {
            this.svPush.init(this);
            this.baseModel.data.step.token = this.baseModel.token;
          }
        });
      });
  }

  ngAfterViewInit() {
    this.svUserFront.loadDdls(this.baseModel, this.baseModel.data.step).then(
      (ret: any) => {
        console.log('user/CreateComponent::ngAfterViewInit()/this.baseModel.data.step:', this.baseModel.data.step)
      });
    // this.svModman.setIconsData$(this.baseModel.data.step, 'icon');
  }


  init() {
    this.baseModel = new BaseModel(USER_STEP_MODEL.module, USER_STEP_MODEL.controller);
    this.baseModel.data.fields = this.svForms.filterByFieldFor(UserModel, FieldFor.createForm);
    this.baseModel.data.wizardModel = UserWizardModel;
    this.baseModel.data.step = this.svForm.filterStepsByController(this.baseModel.data.wizardModel, USER_STEP_MODEL.controller)[0];
    this.baseModel.data.form = this.fb.group(this.svForm.getFormControlConfig(UserModel));
    this.baseModel.data.step.formGroup = this.baseModel.data.form;
    this.baseModel.breadCrumbItems = this.svPage.setBreadCrumbs(USER_STEP_MODEL.controller, 'Create')
  }

  setSelectedIcon(emittedDdlSelection: EmittedDdlSelection) {
    this.svForm.setSelectedIcon(emittedDdlSelection, this.baseModel, this.baseModel.data.step);
  }

  save(step: AWizardStep) {
    let create$: Observable<any>;
    switch (step.controller) {
      case 'module':
        // create$ = this.svModule.createModule$(this.newModule, this.baseModel.token);
        // this.svForm.saveForm(step, this.newModule, createObservable, this.svPush.pushEnvelop, this.svNotif)
        break;
      case 'menu':
        // this.svMenuMod.setUser(step.formGroup!, this.svForm, this.newMenu);
        // createObservable = this.svMenu.createMenu$(this.newMenu, this.baseModel.token);
        // this.svForm.saveForm(step, this.newMenu, createObservable, this.svPush.pushEnvelop, this.svNotif)
        break;
      case 'user':
        create$ = this.svBase.create$(this.newUser,this.baseModel.token);
        this.svForm.saveForm(step, this.newUser, create$, this.svPush.pushEnvelop, this.svNotif)
        break;
    }
  }

  finishFunction() {
    console.log('finishing!!');
  }

}
