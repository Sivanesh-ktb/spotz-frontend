import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CreateSpaceComponent } from '../../../pages/manage-orgs/space/create-space/create-space';
import { ViewSpaceComponent } from '../../../pages/manage-orgs/space/view-space/view-space';
import { SpaceSettingsComponent } from '../../../pages/manage-orgs/space/space-settings/space-settings';
import { RentalSettingsComponent } from '../../../pages/manage-orgs/space/space-settings/rental-settings/rental-settings';
import { BufferTimeComponent } from '../../../pages/manage-orgs/space/space-settings/buffer-time/buffer-time';
import { AddOnComponent } from '../../../pages/manage-orgs/space/space-settings/add-ons/add-ons';
import { DepositsComponent } from '../../../pages/manage-orgs/space/space-settings/deposits/deposits';
import { AllowRefundComponent } from '../../../pages/manage-orgs/space/space-settings/allow-refund/allow-refund';
import { SpacePhotosComponent } from '../../../pages/manage-orgs/space/space-photos/space-photos';
import { UploadPhotosComponent } from '../../../pages/manage-orgs/space/space-photos/upload-photos-popup/upload-photos';
import { SpaceRoutingModule } from './space.routing.module';
import { AdminModule } from '../../../admin.module';
import { CommonPackageModule } from 'src/app/common.package.module';
import { SpaceCalendarComponent } from './space-calendar/space-calendar';
import { SpaceAvailabilityComponent } from './space-availability/space-availability';
import { AddRulePopupComponent } from './space-availability/add-rule-popup/add-rule-popup';
import { CalendarModule } from 'primeng/calendar';
import { AssignSpacePopupComponent } from './space-availability/add-rule-popup/assign-space-popup/assign-space-popup';
import { AvailabilityRulesComponent } from './space-availability/availability-rules/availability-rules';
import { ConfirmSettingPopupComponent } from './space-availability/confirm-setting-popup/confirm-setting-popup';
import { SpaceRuleTableComponent } from './space-availability/availability-rules/space-rule-table/space-rule-table';
import { DeleteAvailabilityComponent } from './space-availability/delete-availability/delete-availability';
import { TimeBlockComponent } from './space-settings/time-block/time-block';

@NgModule({
    declarations: [
      CreateSpaceComponent,
      ViewSpaceComponent,
      SpaceSettingsComponent,
      RentalSettingsComponent,
      BufferTimeComponent,
      AddOnComponent,
      DepositsComponent,
      AllowRefundComponent,
      SpacePhotosComponent,
      UploadPhotosComponent,
      SpaceCalendarComponent,
      SpaceAvailabilityComponent,
      AddRulePopupComponent,
      AssignSpacePopupComponent,
      AvailabilityRulesComponent,
      ConfirmSettingPopupComponent,
      SpaceRuleTableComponent,
      DeleteAvailabilityComponent,
      TimeBlockComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SpaceRoutingModule,
        AdminModule,
        CommonPackageModule,
        CalendarModule,
    ],
    exports: [RouterModule],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ],
  })
  export class SpaceModule { }
