import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { CommonPackageModule } from 'src/app/common.package.module';
import { ManageComponent } from './manage/manage.component';
import { AdminModule } from '../manage/admin.module';
import { UnauthorizedPopupComponent } from './unauthorized-popup/unauthorized-popup';

@NgModule({
  declarations: [
    ManageComponent,
    UnauthorizedPopupComponent

  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    CommonPackageModule,
    AdminModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class UserModule { }
