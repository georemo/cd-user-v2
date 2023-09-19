import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, AuthData, SessService, MenuService, NavService, 
  BaseModel, IAppState, CdObjId, BaseService, LsFilter, StorageType } from '@corpdesk/core';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // providers:[UserService],
})

export class LoginComponent implements OnInit {
  baseModel: BaseModel;
  jwtWsToken: null;
  loginInvalid = false;
  rememberMe = true;
  submitted = false;
  fg: FormGroup;
  postData: any;
  errMsg: any;
  error = '';
  sessCdObj:any;
  constructor(
    private svUser: UserService,
    private svSess: SessService,
    private svMenu: MenuService,
    private svNav: NavService,
    private route: Router,
    private svBase: BaseService,
  ) {
    this.fg = new FormGroup({
      userName: new FormControl(),
      password: new FormControl(),
      rememberMe: new FormControl()
    });
  }

  ngOnInit() {
    const filter: LsFilter = {
      storageType: StorageType.CdObjId,
      cdObjId: {
        appId:'',
        resourceGuid: null,
        resourceName: 'SessService',
        ngModule: 'UserModule',
        jwtToken: this.jwtWsToken,
        socket: null,
        commTrack: null
      }
    }
    this.sessCdObj = this.svBase.searchLocalStorage(filter);
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
        if (res.app_state.sess.cd_token !== null) {
          console.log('user/LoginComponent::initSession/02');
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

  onFocus() {
    this.errMsg = "";
  }

}
