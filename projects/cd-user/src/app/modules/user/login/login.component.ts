import { v4 as uuidv4 } from 'uuid';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import {
  UserService, AuthData, SessService, MenuService, NavService, SioClientService, WebsocketService, ICommConversationSub,
  BaseModel, IAppState, CdObjId, BaseService, LsFilter, StorageType, ICdPushEnvelop, ISocketItem
} from '@corpdesk/core';
import { environment } from '../../../../environments/environment';
// import { SioClientService } from '../../../core/services/sio-client.service';
interface IInitData {
  key: string;
  value: CdObjId;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // providers:[UserService],
})

export class LoginComponent implements OnInit {
  debug = true;
  baseModel: BaseModel;
  resourceGuid = uuidv4();
  jwtWsToken: null;
  loginInvalid = false;
  rememberMe = true;
  submitted = false;
  fg: FormGroup;
  postData: any;
  errMsg: any;
  error = '';
  sidebarInitData: IInitData;
  socketData: ISocketItem[] | null = [];

  constructor(
    private logger: NGXLogger,
    private svSio: SioClientService,
    private svWss: WebsocketService,
    private svUser: UserService,
    private svSess: SessService,
    private svMenu: MenuService,
    private svNav: NavService,
    private route: Router,
    private svBase: BaseService,
  ) {
    this.svSio.env = environment;
    this.svSio.initSio(null, null);
    this.fg = new FormGroup({
      userName: new FormControl(),
      password: new FormControl(),
      rememberMe: new FormControl()
    });
  }

  ngOnInit() {
    this.logger.info('cd-user-v2::LoginComponent::ngOnInit()/StorageType.CdObjId:', StorageType.CdObjId);
    // this.logger.debug('AppComponent initialized');
    
    const filter: LsFilter = {
      storageType: StorageType.CdObjId,
      cdObjId: {
        appId: localStorage.getItem('appId'),
        resourceGuid: null,
        resourceName: 'SidebarComponent',
        ngModule: 'SharedModule',
        jwtToken: localStorage.getItem('accessToken'),
        socket: null,
        commTrack: null
      }
    }
    this.logger.info('cd-user-v2::LoginComponent::ngOnInit()/filter:', filter);
    // this.sidebarInitData = this.svBase.searchLocalStorage(filter);
    this.sidebarInitData = this.searchLocalStorage(filter);
    this.logger.info('user/LoginComponent::ngOnInit()/this.sidebarInitData:', this.sidebarInitData);
    const socketDataStr = localStorage.getItem('socketData')
    if (socketDataStr) {
      this.socketData = JSON.parse(socketDataStr).filter(appInit)
      function appInit(s: ISocketItem): ISocketItem | null {
        if (s.name === 'appInit') {
          return s;
        } else {
          return null;
        }
      }
      this.logger.info('user/LoginComponent::ngOnInit()/this.socketData:', this.socketData);
    } else {
      this.logger.info('Err: socket data is not valid')
    }

  }

  login(fg: any) {
    let authData: AuthData = fg.value;
    const valid = fg.valid;
    this.logger.info('user/LoginComponent::login/01');
    this.logger.info('user/LoginComponent::login/fg:', fg);
    this.logger.info('user/LoginComponent::login/valid:', valid);
    this.submitted = true;
    const consumerGuid = { consumerGuid: environment.consumerToken };
    authData = Object.assign({}, authData, consumerGuid); // merge data with consumer object
    try {
      this.logger.info('user/LoginComponent::login/02');
      if (valid) {
        this.logger.info('user/LoginComponent::login/03');
        this.initSession(authData);
      }
    } catch (err) {
      this.logger.info('user/LoginComponent::login/04');
      this.errMsg = "Something went wrong!!"
      this.loginInvalid = true;
    }
  }

  initSession(authData: AuthData) {
    this.logger.info('user/LoginComponent::initSession/01');
    this.svUser.auth$(authData).subscribe((res: any) => {
      if (res.app_state.success === true) {
        this.logger.info('user/LoginComponent::initSession/res:', JSON.stringify(res));
        this.svSess.appState = res.app_state;
        /*
        create a session on successfull authentication.
        For subsequeng successull request to the server,
        use renewSess(res);
        */
        if (res.app_state.sess.cd_token !== null && res.app_state.success) {
          this.logger.info('user/LoginComponent::initSession/02');
          const envl: ICdPushEnvelop = this.configPushPayload('login', 'push-menu', res.data.userData.userId)
          envl.pushData.m = res.data.menuData;
          this.logger.info('user/LoginComponent::initSession/envl:', envl);
          
          if (environment.wsMode === 'sio') {
            this.svSio.sendPayLoad(envl)
          }

          if (environment.wsMode === 'wss') {
            this.svWss.sendMsg(envl)
          }

          ///////////////////////////////////////
          this.svSess.createSess(res, this.svMenu);
          this.svUser.currentUser = { name: `${res.data.userData.userName}`, picture: `${environment.shellHost}/user-resources/${res.data.userData.userGuid}/avatar-01/a.jpg` };
          this.svNav.userMenu = [
            { title: 'Profile', link: '/pages/cd-auth/register' },
            { title: 'Log out', link: '/pages/cd-auth/logout' }
          ];
          // this.baseModel.sess = res.app_state.sess;
          const params = {
            queryParams: { token: res.app_state.sess.cd_token },
            skipLocationChange: true,
            replaceUrl: false
          };
          // below: old method
          this.route.navigate(['/comm'], params);

          // below new method based on this.baseModel;
          // this.svNav.nsNavigate(this,'/comm','message from cd-user')
        }
      } else {
        this.errMsg = "The userName and password were not valid"
        this.loginInvalid = true;
        this.svSess.logout();
      }
    });

  }

  configPushPayload(triggerEvent: string, emittEvent: string, cuid: number): ICdPushEnvelop {
    this.logger.info('starting cd-user-v2::LoginComponent::configPushPayload()');
    const pushEnvelope: ICdPushEnvelop = {
      pushData: {
        pushGuid: '',
        m: '',
        pushRecepients: [],
        triggerEvent: '',
        emittEvent: '',
        token: '',
        isNotification: null,
        appSockets: this.socketData,
        commTrack: {
          initTime: Number(new Date()),
          relayTime: null,
          relayed: false,
          pushed: false,
          pushTime: null,
          deliveryTime: null,
          delivered: false,
          completed: false,
          completedTime: null
        },
      },
      req: null,
      resp: null
    }

    const users: ICommConversationSub[] = [
      {
        userId: cuid,
        subTypeId: 1,
        cdObjId: {
          appId: environment.appId,
          ngModule: 'UserFrontModule',
          resourceName: 'LoginComponent',
          resourceGuid: uuidv4(),
          jwtToken: '',
          socket: null,
          socketId: '',
          commTrack: {
            initTime: Number(new Date()),
            relayTime: null,
            relayed: false,
            pushed: false,
            pushTime: null,
            deliveryTime: null,
            delivered: false,
            completed: false,
            completedTime: null
          },
        },
      },
    ]

    /**
     * - search socketStore for item with name='appInit'
     * - confirm there is no double entry
     * - save the above socket data in the socketStore of the envelop
     * - this will be used in the push server to push menu data
     */

    const envl: ICdPushEnvelop = { ...pushEnvelope };
    envl.pushData.triggerEvent = triggerEvent;
    envl.pushData.emittEvent = emittEvent;

    // set sender
    const uSender: ICommConversationSub = { ...users[0] }
    uSender.subTypeId = 1;
    envl.pushData.pushRecepients.push(uSender)


    // set recepient
    this.logger.info('cd-user-v2::LoginComponent::configPushPayload()/this.sidebarInitData:', JSON.stringify(this.sidebarInitData));
    this.logger.info('cd-user-v2::LoginComponent::configPushPayload()/this.sidebarInitData.value:', JSON.stringify(this.sidebarInitData.value));
    const uRecepient: ICommConversationSub = { ...users[0] }
    uRecepient.subTypeId = 7;
    this.logger.info('cd-user-v2::LoginComponent::configPushPayload()/uRecepient:', JSON.stringify(uRecepient));
    uRecepient.cdObjId = this.sidebarInitData.value
    envl.pushData.pushRecepients.push(uRecepient)

    this.logger.info('cd-user-v2::LoginComponent::configPushPayload()/envl:', JSON.stringify(envl));

    return envl;

  }

  searchLocalStorage(f: LsFilter) {
    this.logger.info('starting LoginComponent::searchLocalStorage()/lcLength:');
    // const lc = { ...localStorage };
    const lcArr = [];

    const lcLength = localStorage.length;
    this.logger.info('LoginComponent::searchLocalStorage()/lcLength:', lcLength);
    let i = 0;
    for (let i = 0; i < localStorage.length; i++) {
      // try {
      // set iteration key name
      const k = localStorage.key(i);
      // use key name to retrieve the corresponding value
      var v = localStorage.getItem(k!);
      // this.logger.info the iteration key and value
      this.logger.info('Key: ' + k + ', Value: ' + v);
      try {
        this.logger.info('LoginComponent::searchLocalStorage()/1')
        if (typeof (v) === 'object') {
          this.logger.info('LoginComponent::searchLocalStorage()/2')
          this.logger.info('LoginComponent::searchLocalStorage()/v:', v)
          const lcItem = JSON.parse(v!);
          if ('success' in lcItem) {
            this.logger.info('LoginComponent::searchLocalStorage()/3')
            const appState: IAppState = lcItem;
            this.logger.info('LoginComponent::searchLocalStorage()/appState:', appState)
          }
          if ('resourceGuid' in lcItem) {
            this.logger.info('LoginComponent::searchLocalStorage()/4')
            const cdObjId = lcItem;
            this.logger.info('LoginComponent::searchLocalStorage()/cdObjId:', cdObjId)
          }
          this.logger.info('LoginComponent::searchLocalStorage()/5')
          lcArr.push({ key: k, value: JSON.parse(v!) })
        } else {
          this.logger.info('LoginComponent::searchLocalStorage()/typeof (v):', typeof (v))
          this.logger.info('LoginComponent::searchLocalStorage()/6')
          lcArr.push({ key: k, value: JSON.parse(v) })
        }

      } catch (e) {
        this.logger.info('offending item:', v);
        this.logger.info('the item is not an object');
        this.logger.info('Error:', e);
      }

    }
    this.logger.info('LoginComponent::searchLocalStorage()/lcArr:', lcArr);
    this.logger.info('LoginComponent::searchLocalStorage()/f.cdObjId!.resourceName:', f.cdObjId!.resourceName);
    // isAppState
    // const resourceName = 'UserModule';
    const AppStateItems = (d: any) => 'success' in d.value;
    const isObject = (d: any) => typeof (d.value) === 'object';
    const CdObjIdItems = (d: any) => 'resourceName' in d.value;
    const filtObjName = (d: any) => d.value.resourceName === f.cdObjId!.resourceName && d.value.ngModule === f.cdObjId!.ngModule;
    const latestItem = (prev: any, current: any) => (prev.value.commTrack.initTime > current.value.commTrack.initTime) ? prev : current;
    let ret: any = null;
    try {
      if (this.debug) {
        this.logger.info('LoginComponent::searchLocalStorage()/debug=true:');
        ret = lcArr
          .filter((d: any) => {
            if (typeof (d.value) === 'object') {
              this.logger.info('LoginComponent::searchLocalStorage()/filteredByObject: d:', d);
              return d
            } else {
              return null;
            }
          })
          .filter((d: any) => {
            if ('resourceName' in d.value) {
              this.logger.info('LoginComponent::searchLocalStorage()/filteredByResourceNameField: d:', d);
              return d;
            } else {
              return null;
            }
          })
          .filter((d: any) => {
            this.logger.info('LoginComponent::searchLocalStorage()/filteredByName: d:', d);
            this.logger.info('LoginComponent::searchLocalStorage()/filteredByName: d.value.resourceName:', d.value.resourceName);
            this.logger.info('LoginComponent::searchLocalStorage()/filteredByName: f.cdObjId!.resourceName:', f.cdObjId!.resourceName);
            this.logger.info('LoginComponent::searchLocalStorage()/filteredByName: d.value.ngModule:', d.value.ngModule);
            this.logger.info('LoginComponent::searchLocalStorage()/filteredByName: f.cdObjId!.ngModule:', f.cdObjId!.ngModule);
            if (d.value.resourceName === f.cdObjId!.resourceName && d.value.ngModule === f.cdObjId!.ngModule) {
              return d;
            } else {
              return null;
            }
          })
          .reduce(
            (prev = {}, current = {}) => {
              this.logger.info('LoginComponent::searchLocalStorage()/prev:', prev);
              this.logger.info('LoginComponent::searchLocalStorage()/current:', current);
              return (prev.value.commTrack.initTime > current.value.commTrack.initTime) ? prev : current;
            }
          );
      } else {
        this.logger.info('LoginComponent::searchLocalStorage()/debug=false:');
        ret = lcArr
          .filter(isObject)
          .filter(CdObjIdItems!)
          .filter(filtObjName!)
          .reduce(latestItem!)
      }
      this.logger.info('LoginComponent::searchLocalStorage()/ret:', ret);
    } catch (e) {
      this.logger.info('Error:', e);
    }
    return ret;
  }

  onFocus() {
    this.errMsg = "";
  }

}
