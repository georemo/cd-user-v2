import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { UserService, AuthData, SessService, MenuService, NavService, SioClientService, WebsocketService, ICommConversationSub,
  BaseModel, IAppState, CdObjId, BaseService, LsFilter, StorageType, ICdPushEnvelop, ISocketItem } from '@corpdesk/core';
import { NGXLogger } from 'ngx-logger';
import { environment } from '../../../../environments/environment';
import { User } from 'src/app/core/models/auth.models';
import { Router } from '@angular/router';

interface IInitData {
  key: string;
  value: CdObjId;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  debug = true;
  baseModel: BaseModel;
  resourceGuid = uuidv4();
  jwtWsToken: null;
  regInvalid = false;
  // rememberMe = true;
  submitted = false;
  fg: FormGroup;
  postData: any;
  errMsg: any;
  error = '';
  socketData: ISocketItem[] | null = [];
  // fg: FormGroup;
  successmsg = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  sidebarInitData: IInitData;
  constructor(
    private fb: FormBuilder,
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
    // this.fg = new FormGroup({
    //   userName: new FormControl(),
    //   email: new FormControl(),
    //   password: new FormControl(),
    //   confirmPassword: new FormControl(),
    //   // rememberMe: new FormControl()
    // });

    /**
     * once confirmed and after thorough testing,
     * the configurations below can be applied via the user.model settings
     * for cleaner code
     */
    this.fg = this.fb.group({
      userName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

  }

  ngOnInit(): void {
    this.logger.info('cd-user-v2::RegistrationComponent::ngOnInit()/StorageType.CdObjId:', StorageType.CdObjId);
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
    this.logger.info('cd-user-v2::RegistrationComponent::ngOnInit()/filter:', filter);
    // this.sidebarInitData = this.svBase.searchLocalStorage(filter);
    this.sidebarInitData = this.searchLocalStorage(filter);
    this.logger.info('user/RegistrationComponent::ngOnInit()/this.sidebarInitData:', this.sidebarInitData);
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
      this.logger.info('user/RegistrationComponent::ngOnInit()/this.socketData:', this.socketData);
    } else {
      this.logger.info('Err: socket data is not valid')
    }
  }

  ngAfterViewInit(): void {
    this.setInputValue('userName', '')
    this.setInputValue('password', '')
  }

  


  // convenience getter for easy access to form fields
  // get f() { return this.fg.controls; }

  // get password() {
  //   return this.fg.get('password');
  // }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
  }

  get userName() {
    return this.fg.get('userName');
  }

  get email() {
    return this.fg.get('email');
  }

  get password() {
    return this.fg.get('password');
  }

  get confirmPassword() {
    return this.fg.get('confirmPassword');
  }

  // Method to set value for a specific form control
  setInputValue(controlName: string, value: string): void {
    const control = this.fg.get(controlName);
    if (control) {
      control.setValue(value);
    } else {
      console.error(`Control with name '${controlName}' does not exist in the form`);
    }
  }

  register(fg: any) {
    if (this.fg.valid) {
      console.log('Form Submitted!', this.fg.value);
    }
    this.logger.info('starting register/RegistrationComponent::registration');
    let regData: User = fg.value;
    const valid = fg.valid;
    this.logger.info('register/RegistrationComponent::registration/01');
    this.logger.info('register/RegistrationComponent::registration/fg:', fg);
    this.logger.info('register/RegistrationComponent::registration/valid:', valid);
    this.submitted = true;
    const consumerGuid = { consumerGuid: environment.consumerToken };
    regData = Object.assign({}, regData, consumerGuid); // merge data with consumer object
    try {
      this.logger.info('register/RegistrationComponent::registration/02');
      if (valid) {
        this.logger.info('register/RegistrationComponent::registration/03');
        this.svUser.registerUser(regData);
      }
    } catch (err) {
      this.logger.info('register/RegistrationComponent::registration/04');
      this.errMsg = "Something went wrong!!"
      this.regInvalid = true;
    }
  }

  

  searchLocalStorage(f: LsFilter) {
    this.logger.info('starting RegistrationComponent::searchLocalStorage()/lcLength:');
    // const lc = { ...localStorage };
    const lcArr = [];

    const lcLength = localStorage.length;
    this.logger.info('RegistrationComponent::searchLocalStorage()/lcLength:', lcLength);
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
        this.logger.info('RegistrationComponent::searchLocalStorage()/1')
        if (typeof (v) === 'object') {
          this.logger.info('RegistrationComponent::searchLocalStorage()/2')
          this.logger.info('RegistrationComponent::searchLocalStorage()/v:', v)
          const lcItem = JSON.parse(v!);
          if ('success' in lcItem) {
            this.logger.info('RegistrationComponent::searchLocalStorage()/3')
            const appState: IAppState = lcItem;
            this.logger.info('RegistrationComponent::searchLocalStorage()/appState:', appState)
          }
          if ('resourceGuid' in lcItem) {
            this.logger.info('RegistrationComponent::searchLocalStorage()/4')
            const cdObjId = lcItem;
            this.logger.info('RegistrationComponent::searchLocalStorage()/cdObjId:', cdObjId)
          }
          this.logger.info('RegistrationComponent::searchLocalStorage()/5')
          lcArr.push({ key: k, value: JSON.parse(v!) })
        } else {
          this.logger.info('RegistrationComponent::searchLocalStorage()/typeof (v):', typeof (v))
          this.logger.info('RegistrationComponent::searchLocalStorage()/6')
          lcArr.push({ key: k, value: JSON.parse(v) })
        }

      } catch (e) {
        this.logger.info('offending item:', v);
        this.logger.info('the item is not an object');
        this.logger.info('Error:', e);
      }

    }
    this.logger.info('RegistrationComponent::searchLocalStorage()/lcArr:', lcArr);
    this.logger.info('RegistrationComponent::searchLocalStorage()/f.cdObjId!.resourceName:', f.cdObjId!.resourceName);
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
        this.logger.info('RegistrationComponent::searchLocalStorage()/debug=true:');
        ret = lcArr
          .filter((d: any) => {
            if (typeof (d.value) === 'object') {
              this.logger.info('RegistrationComponent::searchLocalStorage()/filteredByObject: d:', d);
              return d
            } else {
              return null;
            }
          })
          .filter((d: any) => {
            if ('resourceName' in d.value) {
              this.logger.info('RegistrationComponent::searchLocalStorage()/filteredByResourceNameField: d:', d);
              return d;
            } else {
              return null;
            }
          })
          .filter((d: any) => {
            this.logger.info('RegistrationComponent::searchLocalStorage()/filteredByName: d:', d);
            this.logger.info('RegistrationComponent::searchLocalStorage()/filteredByName: d.value.resourceName:', d.value.resourceName);
            this.logger.info('RegistrationComponent::searchLocalStorage()/filteredByName: f.cdObjId!.resourceName:', f.cdObjId!.resourceName);
            this.logger.info('RegistrationComponent::searchLocalStorage()/filteredByName: d.value.ngModule:', d.value.ngModule);
            this.logger.info('RegistrationComponent::searchLocalStorage()/filteredByName: f.cdObjId!.ngModule:', f.cdObjId!.ngModule);
            if (d.value.resourceName === f.cdObjId!.resourceName && d.value.ngModule === f.cdObjId!.ngModule) {
              return d;
            } else {
              return null;
            }
          })
          .reduce(
            (prev = {}, current = {}) => {
              this.logger.info('RegistrationComponent::searchLocalStorage()/prev:', prev);
              this.logger.info('RegistrationComponent::searchLocalStorage()/current:', current);
              return (prev.value.commTrack.initTime > current.value.commTrack.initTime) ? prev : current;
            }
          );
      } else {
        this.logger.info('RegistrationComponent::searchLocalStorage()/debug=false:');
        ret = lcArr
          .filter(isObject)
          .filter(CdObjIdItems!)
          .filter(filtObjName!)
          .reduce(latestItem!)
      }
      this.logger.info('RegistrationComponent::searchLocalStorage()/ret:', ret);
    } catch (e) {
      this.logger.info('Error:', e);
    }
    return ret;
  }

}
