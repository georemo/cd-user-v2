import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupMemberRoutingModule } from './group-member-routing.module';
import { CreateComponent } from './create/create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeleteComponent } from './delete/delete.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [
    CreateComponent,
    DashboardComponent,
    DeleteComponent,
    EditComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    GroupMemberRoutingModule
  ]
})
export class GroupMemberModule { }
