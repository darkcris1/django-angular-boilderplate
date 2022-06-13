import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UIRouterModule } from '@uirouter/angular';
import { USERS_ROUTES } from './users.route';
import { GlobalModule } from '../global/global.module';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    GlobalModule,
    UIRouterModule.forChild({ states: USERS_ROUTES })
  ]
})
export class UsersModule { }
