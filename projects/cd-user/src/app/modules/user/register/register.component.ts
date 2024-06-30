import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, ISocketItem } from '@corpdesk/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
  socketData: ISocketItem[] | null = [];
  // signupForm: FormGroup;
  successmsg = false;

  // set the currenr year
  year: number = new Date().getFullYear();
  constructor() { }

  ngOnInit(): void {
  }

  // convenience getter for easy access to form fields
  get f() { return this.fg.controls; }

  register(fg: any) {
    // this.logger.info('starting user/LoginComponent::login');
    // let authData: AuthData = fg.value;
    // const valid = fg.valid;
    // this.logger.info('user/LoginComponent::login/01');
    // this.logger.info('user/LoginComponent::login/fg:', fg);
    // this.logger.info('user/LoginComponent::login/valid:', valid);
    // this.submitted = true;
    // const consumerGuid = { consumerGuid: environment.consumerToken };
    // authData = Object.assign({}, authData, consumerGuid); // merge data with consumer object
    // try {
    //   this.logger.info('user/LoginComponent::login/02');
    //   if (valid) {
    //     this.logger.info('user/LoginComponent::login/03');
    //     this.initSession(authData);
    //   }
    // } catch (err) {
    //   this.logger.info('user/LoginComponent::login/04');
    //   this.errMsg = "Something went wrong!!"
    //   this.loginInvalid = true;
    // }
  }

}
