import { Validators } from "@angular/forms";
import { ActionType, AWizardModel, ControlType, DdlCtx, DdlData, EMAIL_PATTERN, FieldFor, FieldInfo, FieldType, FormsService, IQuery, URL_PATTERN } from "@corpdesk/core";
import { of } from "rxjs";

const svForms = new FormsService();

// DB FIELDS: consumer_id, consumer_name, consumer_guid, company_id, company_guid, consumer_enabled


export const ConsumerModel: FieldInfo[] = [
    { title: 'ID', name: 'consumerId', dbName: 'consumer_id', type: FieldType.string, fetchable: true, updateable: true, index: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'alphanum' },
    { title: 'Guid', name: 'consumerGuid', dbName: 'consumer_guid', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'alphanum', disabled: true },
    { title: 'Name', name: 'consumerName', dbName: 'consumer_name', type: FieldType.string, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.createForm }, { controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true, formControlsConfig: ['', [Validators.minLength(3), Validators.maxLength(20), Validators.required]] },    
    { title: 'Company', name: 'companyId', dbName: 'company_id', type: FieldType.string, fetchable: true, updateable: true, index: true, show: true, controls: [{ controlType: ControlType.text, fieldFor: FieldFor.tableDisplay }, { controlType: ControlType.searchDropDown, fieldFor: FieldFor.createForm }], ddlInfo: { selData$: of([]), selValueField: 'companyName', selIndex: 'companyId', selPlaceholder: '...Choose', data: null }, formatt: 'text', disabled: true, savable: true, formControlsConfig: ['', [Validators.minLength(3), Validators.maxLength(42), Validators.required]] },  
    { title: 'Enabled', name: 'consumerEnabled', dbName: 'consumer_enabled', type: FieldType.boolean, fetchable: true, updateable: true, searchable: true, show: true, controls: [{ controlType: ControlType.status, fieldFor: FieldFor.tableDisplay }], formatt: 'text', isNameField: true, savable: true },
    { title: 'Action', name: 'action', type: FieldType.action, fetchable: false, show: true, controls: [{ controlType: ControlType.action, fieldFor: FieldFor.tableDisplay }, { controlType: ControlType.action, fieldFor: FieldFor.createForm }], Fn: 'createConsumer' },
    { title: 'Search', name: 'iconSearch', type: FieldType.any, controls: [], formControlsConfig: ['', []] }
]

export const DEFAULT_INSERTABLE_CONSUMER: any = {
    data: {},
    valid: null,
    ctx: 'Sys'
}

export interface IConsumerModel {
    consumerId?: number;
    consumerGuid?: string;
    consumerName?: string;
    consumerTypeGuid?: string;
    postalAddress?: string; 
    phone?: string; 
    email?: string;
    website?: string;
    physicalLocation?: string;
    city?: string;
    country?: string;
    logo?: string;
    consumerEnabled?: boolean;
    searchTags?: string;
}

export const CONSUMER_STEP_MODEL = {
    token: '',
    stepTitle: 'Create Consumer',
    stepItems: { nextButtonId: 'stepToMenu' }, // to be automated
    tabPaneId: 'consumerInfo',
    cardTitle: 'Consumer Information',
    cardTitleDesc: 'Fill all information below',
    module: 'Moduleman',
    controller: 'Consumer',
    formGroup: null,
    fields: svForms.filterByFieldFor(ConsumerModel, FieldFor.createForm),
}

export const ConsumerWizardModel: AWizardModel = {
    name: 'Consumer Wizard',
    steps: [
        CONSUMER_STEP_MODEL
    ]
}

// DROPDOWN MODEL
export const consumerGetQuery: IQuery = {
    select: ['consumerId', 'consumerName', 'consumerGuid'],
    where: {}
}

export const consumerDdlCtx: DdlCtx = {
    getFn$: null,
    selIndex: consumerGetQuery.select![0],
    selValueField: consumerGetQuery.select![1],
    fetchFields: consumerGetQuery.select!,
    step: null,
    token: null,
    controlName: 'consumerId',
};

/////////////
export const consumerTypeGetQuery: IQuery = {
    select: ['consumerTypeId', 'consumerTypeName', 'consumerTypeGuid'],
    where: {}
}
export const consumerTypeDdlCtx: DdlCtx = {
    getFn$: null,
    selIndex: consumerTypeGetQuery.select![2],
    selValueField: consumerTypeGetQuery.select![1],
    fetchFields: consumerTypeGetQuery.select!,
    step: null,
    token: null,
    controlName: 'consumerTypeGuid',
};

export const DEFAULT_DDLD: DdlData[] = [
    {
        menuName: 'create',
        menuGuid: 'bd9b5bda5ab',
        navLocation: '/moduleman/consumer/create',
        actionType: ActionType.navigate,
    },
    {
        menuName: 'dashboard',
        menuGuid: 'd27294db59c1',
        navLocation: '/moduleman/consumer/dashboard',
        actionType: ActionType.navigate
    }
];


