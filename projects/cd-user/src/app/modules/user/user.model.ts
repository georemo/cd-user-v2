import { Validators } from "@angular/forms";
import { ActionType, AWizardModel, ControlType, DdlCtx, DdlData, EMAIL_PATTERN, FieldFor, FieldInfo, FieldType, FormsService, IQuery } from "@corpdesk/core";
import { of } from "rxjs";

const svForms = new FormsService();

// DB FIELDS: user_id, user_guid, user_name, email, mobile, gender, birth_date, postal_addr, f_name, m_name, l_name, national_id, passport_id, user_enabled, company_id

export const UserModel: FieldInfo[] = [
    { title: 'ID', name: 'userId', dbName: 'user_id', type: FieldType.string, fetchable: true, updateable: true, index: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'alphanum' },
    { title: 'Guid', name: 'userGuid', dbName: 'user_guid', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'alphanum', disabled: true },
    { title: 'Name', name: 'userName', dbName: 'user_name', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.createForm }, { controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true, formControlsConfig: ['', [Validators.minLength(3), Validators.maxLength(20), Validators.required]] },
    { title: 'F.Name', name: 'fName', dbName: 'f_name', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.createForm }, { controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true, formControlsConfig: ['', [Validators.minLength(3), Validators.maxLength(20), Validators.required]] },
    { title: 'M.Name', name: 'mName', dbName: 'm_name', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.createForm }, { controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true, formControlsConfig: ['', [Validators.minLength(3), Validators.maxLength(20), Validators.required]] },
    { title: 'L.Name', name: 'lName', dbName: 'l_name', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.createForm }, { controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true, formControlsConfig: ['', [Validators.minLength(3), Validators.maxLength(20), Validators.required]] },
    { title: 'NID', name: 'nationalId', dbName: 'national_id', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.createForm }, { controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true, formControlsConfig: ['', [Validators.minLength(3), Validators.maxLength(20), Validators.required]] },
    { title: 'PID', name: 'passportId', dbName: 'passport_id', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.createForm }, { controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true, formControlsConfig: ['', [Validators.minLength(3), Validators.maxLength(20), Validators.required]] },
    { title: 'Postal', name: 'postalAddress', dbName: 'postal_address', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.createForm }, { controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true, formControlsConfig: ['', [Validators.minLength(1), Validators.maxLength(20), Validators.required]] },
    { title: 'Mobile', name: 'mobile', dbName: 'mobile', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.createForm }, { controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true, formControlsConfig: ['', [Validators.minLength(8), Validators.maxLength(14), Validators.required]] },
    { title: 'Email', name: 'email', dbName: 'email', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.createForm }, { controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true, formControlsConfig: ['', [Validators.pattern(EMAIL_PATTERN), Validators.required]] }, 
    { title: 'Company', name: 'companyId', dbName: 'company_id', type: FieldType.string, fetchable: true, updateable: true, index: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }, { controlType: ControlType.searchDropDown, fieldFor: FieldFor.createForm }], ddlInfo: { selData$: of([]), selValueField: 'companyName', selIndex: 'companyId', selPlaceholder: '...Choose', data: null }, formatt: 'text', disabled: true, savable: true, formControlsConfig: ['', [Validators.minLength(3), Validators.maxLength(42), Validators.required]] },  
    { title: 'Gender', name: 'gender', dbName: 'gender', type: FieldType.boolean, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.status, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true },
    { title: 'Enabled', name: 'userEnabled', dbName: 'user_enabled', type: FieldType.boolean, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.status, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true },
    { title: 'Action', name: 'action', type: FieldType.action, fetchable: false, show: true, controls: [{ controlType: ControlType.action, fieldFor: FieldFor.tableDisplay }, { controlType: ControlType.action, fieldFor: FieldFor.createForm }], Fn: 'createUser' },
    { title: 'Search', name: 'iconSearch', type: FieldType.any, controls: [], formControlsConfig: ['', []] }
]

export const DEFAULT_INSERTABLE_USER: any = {
    data: {},
    valid: null,
    ctx: 'Sys'
}

export interface IUserModel {
    userId?: number;
    userGuid?: string;
    userName?: string;
    fName?: string;
    mName?: string;
    lName?: string;
    nationalId?: string;
    passportId?: string;
    postalAddress?: string; 
    mobile?: string; 
    email?: string;
    company_id?: number;
    gender?: boolean;
    userEnabled?: boolean;
}

export const USER_STEP_MODEL = {
    token: '',
    stepTitle: 'Create User',
    stepItems: { nextButtonId: 'stepToMenu' }, // to be automated
    tabPaneId: 'userInfo',
    cardTitle: 'User Information',
    cardTitleDesc: 'Fill all information below',
    module: 'User',
    controller: 'User',
    formGroup: null,
    fields: svForms.filterByFieldFor(UserModel, FieldFor.createForm),
}

export const UserWizardModel: AWizardModel = {
    name: 'User Wizard',
    steps: [
        USER_STEP_MODEL
    ]
}

export const userGetQuery: IQuery = {
    select: ['userId', 'userName', 'userGuid'],
    where: {}
}

export const userDdlCtx: DdlCtx = {
    getFn$: null,
    selIndex: userGetQuery.select![0],
    selValueField: userGetQuery.select![1],
    fetchFields: userGetQuery.select!,
    step: null,
    token: null,
    controlName: 'userId',
};

export const DEFAULT_DDLD: DdlData[] = [
    {
        menuName: 'create',
        menuGuid: 'bd9b5bda5ab',
        navLocation: '/user/user/create',
        actionType: ActionType.navigate,
    },
    {
        menuName: 'dashboard',
        menuGuid: 'd27294db59c1',
        navLocation: '/user/user/dashboard',
        actionType: ActionType.navigate
    }
];


