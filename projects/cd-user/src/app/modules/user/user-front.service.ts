import { Injectable } from '@angular/core';
import { AWizardStep, BaseModel, BaseService, FieldInfo } from '@corpdesk/core';
import { userDdlCtx, userGetQuery } from './user.model';
import { UserBaseService } from '../user-base.service';

@Injectable({
    providedIn: 'root'
})
export class UserFrontService {
    constructor(
        private svBase: BaseService,
        private svUserBase: UserBaseService,
    ) {

    }

    async loadDdls(baseModel: BaseModel, consumerStep: AWizardStep) {
        // moduleDdlCtx.token = baseModel.token;
        // moduleDdlCtx.step = consumerStep;
        // moduleDdlCtx.controlName = 'consumerTypeGuid';
        // moduleDdlCtx.getFn$ = this.svModule.getModule$(moduleGetQuery, baseModel.token);
        // await this.svModman.setDdl$(await moduleDdlCtx)
        //     .subscribe((ret) => {
        //         // console.log('menu/ConsumerModService::loadDdls()/ret(modules):', ret)
        //         consumerStep.fields.forEach((f: FieldInfo) => {
        //             if (f.name === 'consumerTypeGuid') {
        //                 f.ddlInfo!.data = ret;
        //             }
        //         })
        //     })

        userDdlCtx.token = baseModel.token;
        userDdlCtx.step = consumerStep;
        userDdlCtx.controlName = 'userId';
        console.log('ConsumerModService::loadDdls()/userGetQuery:', userGetQuery)
        userDdlCtx.getFn$ = this.svBase.getPaged$(userGetQuery, baseModel.token,'Sys','Moduleman','Company');
        await this.svUserBase.setDdl$(await userDdlCtx)
            .subscribe((ret) => {
                console.log('menu/ConsumerModService::loadDdls()/ret(companies):', ret)
                consumerStep.fields.forEach((f: FieldInfo) => {
                    if (f.name === 'userId') {
                        f.ddlInfo!.data = ret;
                    }
                })
            })
    }


}