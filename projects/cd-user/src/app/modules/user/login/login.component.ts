import { v4 as uuidv4 } from 'uuid';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  ActivatedRoute, Router,
  Event as NavigationEvent,
  /**
   * router events
   */
  NavigationStart, //	the Angular router stats the navigation.
  RouteConfigLoadStart, //	the Router lazy loads a route configuration.
  RouteConfigLoadEnd, //	after a route has been lazy-loaded.
  RoutesRecognized, //	the Router parses the URL and the routes are recognized.
  GuardsCheckStart, //	the Router begins the Guards phase of routing.
  ChildActivationStart, //	the Router begins activating a route's children.
  ActivationStart, //	the Router begins activating a route.
  GuardsCheckEnd, //	the Router finishes the Guards phase of routing successfully.
  ResolveStart, //	the Router begins the Resolve phase of routing.
  ResolveEnd, //	the Router finishes the Resolve phase of routing successfully.
  ChildActivationEnd, //	the Router finishes activating a route's children.
  ActivationEnd, //	the Router finishes activating a route. 
} from '@angular/router';
import {
  UserService, AuthData, SessService, MenuService, NavService, SioClientService, ICommConversationSub,
  BaseModel, IAppState, CdObjId, BaseService, LsFilter, StorageType, ICdPushEnvelop, ISocketItem, AclService
} from '@corpdesk/core';
import { environment } from '../../../../environments/environment';
import { NazTableService } from '@corpdesk/naz';
// import { SioClientService } from '../../../core/services/sio-client.service';
interface IInitData {
  key: string;
  value: CdObjId;
}

let baseModel: any = null;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // providers:[UserService],
})

export class LoginComponent implements OnInit {
  debug = true;
  baseModel: BaseModel = new BaseModel('', '');
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
    private svSio: SioClientService,
    private svUser: UserService,
    private svSess: SessService,
    private svMenu: MenuService,
    private svNazTable: NazTableService,
    private svAcl: AclService,
    private route: ActivatedRoute,
    private router: Router,
    private svNav: NavService,
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
    /**
     * login does not requre acl access
     * therefore does not require 
     * this.aRoute.queryParams
     */
    // this.aRoute.queryParams
    //   .subscribe(params => {
    //     if (params) {
    //       this.svAcl.initComponent(params, this, this.svSess).then((ret) => {
    //         if (ret) {
    //           // this.sQuery = this.svNazTable.initSQuery(this);
    //           // this.dsEmittData = this.svNazTable.initEmittData(this);
    //         } else {
    //           this.svNav.nsNavigate(this, '/', 'Error loading ModuleList page')
    //         }
    //       });
    //     }
    //   });

    // baseModel = this.baseModel;

    // /**
    //  * listen to router events
    //  */
    // this.router.events
    //   .subscribe(
    //     (event: NavigationEvent) => {
    //       // NavigationStart, //	the Angular router stats the navigation.
    //       if (event instanceof NavigationStart) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: the Angular router stats the navigation');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: NavigationStart:', event);
    //       }
    //       // RouteConfigLoadStart, //	the Router lazy loads a route configuration.
    //       if (event instanceof RouteConfigLoadStart) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: the Router lazy loads a route configuration');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: RouteConfigLoadStart:', event);
    //       }
    //       // RouteConfigLoadEnd, //	after a route has been lazy-loaded.
    //       if (event instanceof RouteConfigLoadEnd) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: after a route has been lazy-loaded.');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: RouteConfigLoadEnd:', event);
    //       }
    //       // RoutesRecognized, //	the Router parses the URL and the routes are recognized.
    //       if (event instanceof RoutesRecognized) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: the Router parses the URL and the routes are recognized.');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: RoutesRecognized:', event);
    //       }
    //       // GuardsCheckStart, //	the Router begins the Guards phase of routing.
    //       if (event instanceof GuardsCheckStart) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: the Router begins the Guards phase of routing.');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: GuardsCheckStart:', event);
    //       }
    //       // ChildActivationStart, //	the Router begins activating a route's children.
    //       if (event instanceof ChildActivationStart) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: the Router begins activating a routes children.');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: ChildActivationStart:', event);
    //       }
    //       // ActivationStart, //	the Router begins activating a route.
    //       if (event instanceof ActivationStart) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: the Router begins activating a route.');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: ActivationStart:', event);
    //       }
    //       // GuardsCheckEnd, //	the Router finishes the Guards phase of routing successfully.
    //       if (event instanceof GuardsCheckEnd) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: the Router finishes the Guards phase of routing successfully.');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: GuardsCheckEnd:', event);
    //       }
    //       // ResolveStart, //	the Router begins the Resolve phase of routing.
    //       if (event instanceof ResolveStart) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: the Router parses the URL and the routes are recognized.');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: ResolveStart:', event);
    //       }
    //       // ResolveEnd, //	the Router finishes the Resolve phase of routing successfully.
    //       if (event instanceof ResolveEnd) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: the Router finishes the Resolve phase of routing successfully.');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: ResolveEnd:', event);
    //       }
    //       // ChildActivationEnd, //	the Router finishes activating a route's children.
    //       if (event instanceof ChildActivationEnd) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: the Router finishes activating a routes children.');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: ChildActivationEnd:', event);
    //       }
    //       // ActivationEnd, //	the Router finishes activating a route. 
    //       if (event instanceof ActivationEnd) {
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: Description: the Router finishes activating a route.');
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/this.baseModel.token:', this.baseModel.token);
    //         console.log('cdUserV2::LoginComponent::ngOnInit()/router event: ActivationEnd:', event);
    //       }

    //     });

    console.log('cd-user-v2::LoginComponent::ngOnInit()/StorageType.CdObjId:', StorageType.CdObjId);
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
    console.log('cd-user-v2::LoginComponent::ngOnInit()/filter:', filter);
    this.sidebarInitData = this.svBase.searchLocalStorage(filter);
    // this.sidebarInitData = this.searchLocalStorage(filter);
    console.log('user/LoginComponent::ngOnInit()/this.sidebarInitData:', this.sidebarInitData);
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
      console.log('user/LoginComponent::ngOnInit()/this.socketData:', this.socketData);
    } else {
      console.log('Err: socket data is not valid')
    }



  }

  login(fg: any) {
    let authData: AuthData = fg.value;
    const valid = fg.valid;
    console.log('user/LoginComponent::login/01');
    console.log('user/LoginComponent::login/fg:', fg);
    console.log('user/LoginComponent::login/valid:', valid);
    this.submitted = true;
    const consumerGuid = { consumerGuid: environment.consumerToken };
    authData = Object.assign({}, authData, consumerGuid); // merge data with consumer object
    try {
      console.log('user/LoginComponent::login/02');
      if (valid) {
        console.log('user/LoginComponent::login/03');
        this.initSession(authData);
      }
    } catch (err) {
      console.log('user/LoginComponent::login/04');
      this.errMsg = "Something went wrong!!"
      this.loginInvalid = true;
    }
  }

  initSession(authData: AuthData) {
    console.log('user/LoginComponent::initSession/01');
    this.svUser.auth$(authData).subscribe((res: any) => {
      if (res.app_state.success === true) {
        console.log('user/LoginComponent::initSession/res:', JSON.stringify(res));
        this.svSess.appState = res.app_state;
        /*
        create a session on successfull authentication.
        For subsequeng successull request to the server,
        use renewSess(res);
        */
        if (res.app_state.sess.cd_token !== null && res.app_state.success) {
          console.log('user/LoginComponent::initSession/02');
          const envl: ICdPushEnvelop = this.configPushPayload('login', 'push-menu', res.data.userData.userId)
          envl.pushData.m = res.data.menuData;
          envl.pushData.token = res.app_state.sess.cd_token;
          console.log('user/LoginComponent::initSession/envl:', envl);
          this.svSio.sendPayLoad(envl)
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
          this.router.navigate(['/comm'], params);

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
    console.log('starting cd-user-v2::LoginComponent::configPushPayload()');
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
    console.log('cd-user-v2::LoginComponent::configPushPayload()/this.sidebarInitData:', JSON.stringify(this.sidebarInitData));
    console.log('cd-user-v2::LoginComponent::configPushPayload()/this.sidebarInitData.value:', JSON.stringify(this.sidebarInitData.value));
    const uRecepient: ICommConversationSub = { ...users[0] }
    uRecepient.subTypeId = 7;
    console.log('cd-user-v2::LoginComponent::configPushPayload()/uRecepient:', JSON.stringify(uRecepient));
    uRecepient.cdObjId = this.sidebarInitData.value
    envl.pushData.pushRecepients.push(uRecepient)

    console.log('cd-user-v2::LoginComponent::configPushPayload()/envl:', JSON.stringify(envl));

    return envl;

  }

  // searchLocalStorage(f: LsFilter) {
  //   console.log('starting LoginComponent::searchLocalStorage()/lcLength:');
  //   // const lc = { ...localStorage };
  //   const lcArr = [];

  //   const lcLength = localStorage.length;
  //   // console.log('LoginComponent::searchLocalStorage()/lcLength:', lcLength);
  //   let i = 0;
  //   for (let i = 0; i < localStorage.length; i++) {
  //     // try {
  //     // set iteration key name
  //     const k = localStorage.key(i);
  //     // use key name to retrieve the corresponding value
  //     var v = localStorage.getItem(k!);
  //     // console.log the iteration key and value
  //     console.log('Key: ' + k + ', Value: ' + v);
  //     try {
  //       // console.log('LoginComponent::searchLocalStorage()/1')
  //       if (typeof (v) === 'object') {
  //         // console.log('LoginComponent::searchLocalStorage()/2')
  //         // console.log('LoginComponent::searchLocalStorage()/v:', v)
  //         const lcItem = JSON.parse(v!);
  //         if ('success' in lcItem) {
  //           // console.log('LoginComponent::searchLocalStorage()/3')
  //           const appState: IAppState = lcItem;
  //           // console.log('LoginComponent::searchLocalStorage()/appState:', appState)
  //         }
  //         if ('resourceGuid' in lcItem) {
  //           // console.log('LoginComponent::searchLocalStorage()/4')
  //           const cdObjId = lcItem;
  //           // console.log('LoginComponent::searchLocalStorage()/cdObjId:', cdObjId)
  //         }
  //         // console.log('LoginComponent::searchLocalStorage()/5')
  //         lcArr.push({ key: k, value: JSON.parse(v!) })
  //       } else {
  //         // console.log('LoginComponent::searchLocalStorage()/typeof (v):', typeof (v))
  //         // console.log('LoginComponent::searchLocalStorage()/6')
  //         lcArr.push({ key: k, value: JSON.parse(v) })
  //       }

  //     } catch (e) {
  //       console.log('offending item:', v);
  //       console.log('the item is not an object');
  //       console.log('Error:', e);
  //     }

  //   }
  //   console.log('LoginComponent::searchLocalStorage()/lcArr:', lcArr);
  //   // console.log('LoginComponent::searchLocalStorage()/f.cdObjId!.resourceName:', f.cdObjId!.resourceName);
  //   // isAppState
  //   // const resourceName = 'UserModule';
  //   const AppStateItems = (d: any) => 'success' in d.value;
  //   const isObject = (d: any) => typeof (d.value) === 'object';
  //   const CdObjIdItems = (d: any) => 'resourceName' in d.value;
  //   const filtObjName = (d: any) => d.value.resourceName === f.cdObjId!.resourceName && d.value.ngModule === f.cdObjId!.ngModule;
  //   const latestItem = (prev: any, current: any) => (prev.value.commTrack.initTime > current.value.commTrack.initTime) ? prev : current;
  //   let ret: any = null;
  //   try {
  //     if (this.debug) {
  //       // console.log('LoginComponent::searchLocalStorage()/debug=true:');
  //       ret = lcArr
  //         .filter((d: any) => {
  //           if (typeof (d.value) === 'object') {
  //             // console.log('LoginComponent::searchLocalStorage()/filteredByObject: d:', d);
  //             return d
  //           } else {
  //             return null;
  //           }
  //         })
  //         .filter((d: any) => {
  //           if ('resourceName' in d.value) {
  //             // console.log('LoginComponent::searchLocalStorage()/filteredByResourceNameField: d:', d);
  //             return d;
  //           } else {
  //             return null;
  //           }
  //         })
  //         .filter((d: any) => {
  //           // console.log('LoginComponent::searchLocalStorage()/filteredByName: d:', d);
  //           // console.log('LoginComponent::searchLocalStorage()/filteredByName: d.value.resourceName:', d.value.resourceName);
  //           // console.log('LoginComponent::searchLocalStorage()/filteredByName: f.cdObjId!.resourceName:', f.cdObjId!.resourceName);
  //           // console.log('LoginComponent::searchLocalStorage()/filteredByName: d.value.ngModule:', d.value.ngModule);
  //           // console.log('LoginComponent::searchLocalStorage()/filteredByName: f.cdObjId!.ngModule:', f.cdObjId!.ngModule);
  //           if (d.value.resourceName === f.cdObjId!.resourceName && d.value.ngModule === f.cdObjId!.ngModule) {
  //             return d;
  //           } else {
  //             return null;
  //           }
  //         })
  //         .reduce(
  //           (prev = {}, current = {}) => {
  //             // console.log('LoginComponent::searchLocalStorage()/prev:', prev);
  //             console.log('LoginComponent::searchLocalStorage()/current:', current);
  //             return (prev.value.commTrack.initTime > current.value.commTrack.initTime) ? prev : current;
  //           }
  //         );
  //     } else {
  //       // console.log('LoginComponent::searchLocalStorage()/debug=false:');
  //       ret = lcArr
  //         .filter(isObject)
  //         .filter(CdObjIdItems!)
  //         .filter(filtObjName!)
  //         .reduce(latestItem!)
  //     }
  //     // console.log('LoginComponent::searchLocalStorage()/ret:', ret);
  //   } catch (e) {
  //     console.log('Error:', e);
  //   }
  //   return ret;
  // }

  onFocus() {
    this.errMsg = "";
  }

}
