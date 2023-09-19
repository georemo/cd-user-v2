import { Injectable } from '@angular/core';
import { Routes } from '@angular/router';
import { AWizardStep, CdPushEnvelop, DdlCtx, DdlData, FieldInfo, FormsService, ICdResponse, IQuery, MenuService, NotificationService } from '@corpdesk/core';
import { Observable, of, Subject } from 'rxjs';

const RoutesData = [
    {menuName: 'acl', moduleName:'AclModule'},
    {menuName: 'menu', moduleName:'MenuModule'},
    {menuName: 'module', moduleName:'ModuleModule'},
    {menuName: 'cd-obj', moduleName:'CdObjModule'},
]

// export function getRoutes(): Routes {
//     const baseRoute = [ { path: '', redirectTo: 'home', pathMatch: 'full' }];
//     const mainRoutes:any[] = RoutesData.map((r) => {
//         return {
//             path: r.menuName,
//             loadChildren: () => import(`./${r.menuName}/${r.menuName}.module`).then(m => m[`${r.moduleName}`]),
//         }
//     });
//     mainRoutes.push(baseRoute[0]);
//     return mainRoutes;
// }

@Injectable({
    providedIn: 'root'
})
export class UserBaseService {
    token: string;

    ddlData: DdlData = {
        config: { suppressScrollX: true, wheelSpeed: 0.3 },
        header: {
            title: { lable: 'Notifications', cls: '', action: null },
            sideLink: { lable: 'View All', cls: '', action: null },
        },
        footer: { label: 'View All', icon: '', action: null },
        data: [
            {
                label: 'item 1',
                description: 'If several languages coalesce the grammar',
                time: '3 min ago',
                // iconId: '',
                // iconName: '',
                // action: null,
                // attributes: {
                //   id: 'atlassian',
                //   membership: {
                //     free: ['brands'],
                //     pro: ['brands']
                //   },
                //   styles: ['brands'],
                //   unicode: 'f77b',
                //   voted: true
                // },
                // id: 'atlassian',
                // links: {
                //   self: '/api/icons/atlassian'
                // },
                // type: 'icon'
            },
            {
                label: 'item 2',
                description: 'It will seem like simplified English',
                time: '1 hr ago'
            },
            {
                label: 'item 3',
                description: 'If several languages coalesce the grammar',
                time: '4 hr ago'
            }
        ]
    }

    pushEnvelop: CdPushEnvelop = {
        pushRecepients: [],
        pushData: null,
        emittEvent: 'push-notif',
        triggerEvent: 'send-notif',
        req: null,
        resp: null
    };

    numericNumberReg1 = '^-?[0-9]\\d*(\\.\\d{1,2})?$';
    numericNumberReg2 = '/^[0-9]\d*$/';
    numericNumberReg3 = new RegExp(/^-?[0-9]\\d*(\\.\\d{1,2})?$/, 'i')
    numericNumberReg4 = new RegExp(/^[0-9]\d*$/, 'i')
    constructor(
        private svMenu: MenuService,
        private svNotif: NotificationService,
        private svForm: FormsService
    ) {

    }

    // setMenus$(step: AWizardStep) {
    //     const q: IQuery = {
    //         select: ['menuId', 'menuName'],
    //         where: { menuEnabled: true }
    //     }
    //     if (this.token) {
    //         this.svMenu.getMenuList$(q, this.token)
    //             .subscribe((r: any) => {
    //                 const response: ICdResponse = r;
    //                 if (response.app_state.success) {
    //                     console.log('response.data.items:', response.data.items)
    //                     step.fields.map((f: FieldInfo, i: number) => {
    //                         if (f.name === 'menuParentId') {
    //                             step.fields[i].ddlInfo!.selData$ = of(response.data.items);
    //                             step.fields[i].ddlInfo!.selIndex = 'menuId';
    //                             step.fields[i].ddlInfo!.selValueField = 'menuName';
    //                             step.fields[i].ddlInfo!.selPlaceholder = '...Choose';
    //                         }
    //                     })

    //                 } else {
    //                     console.log('setMenu$()/response:', response)
    //                     console.log('...error fetching menu data!!')
    //                     this.pushEnvelop.pushData = response;
    //                     this.pushEnvelop.resp = response;
    //                     this.svNotif.emitNotif(this.pushEnvelop);
    //                 }
    //             })
    //     }
    // }

    setIconsData$(step: AWizardStep, controlName: string) {
        step.fields.map((f: FieldInfo, i: number) => {
            if (f.name === controlName) {
                step.fields[i].ddlInfo!.selData$ = of(this.ddlData);
                step.fields[i].ddlInfo!.selIndex = 'iconId';
                step.fields[i].ddlInfo!.selValueField = 'iconName';
                step.fields[i].ddlInfo!.selPlaceholder = '...Choose';
            }
        })
    }

    setDdl$(ddlCtx: DdlCtx): Observable<any> {
        if (ddlCtx.token) {
            const subject = new Subject<any>();
            let ret: any = [];
            ddlCtx.getFn$!
                .subscribe((r: any) => {
                    const response: ICdResponse = r;
                    console.log('ModulemanService::setDdl$()/response:', response)
                    if (response.app_state.success) {
                        ret = response.data.items;
                        ddlCtx.step!.fields.map((f: FieldInfo, i: number) => {
                            if (f.name === ddlCtx.controlName) {
                                ddlCtx.step!.fields[i].ddlInfo!.selData$! = of(response.data.items);
                                ddlCtx.step!.fields[i].ddlInfo!.selIndex = ddlCtx.selIndex;
                                ddlCtx.step!.fields[i].ddlInfo!.selValueField = ddlCtx.selValueField;
                                ddlCtx.step!.fields[i].ddlInfo!.selPlaceholder = '...Choose';
                            }
                        })
                        subject.next(ret);
                    } else {
                        this.pushEnvelop.pushData = response;
                        this.pushEnvelop.resp = response;
                        this.svNotif.emitNotif(this.pushEnvelop);
                        subject.next(ret);
                    }
                })
            return subject.asObservable();
        } else {
            return of([]);
        }

    }



}