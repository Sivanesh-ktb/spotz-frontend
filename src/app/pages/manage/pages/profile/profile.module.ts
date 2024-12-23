
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AdminModule } from '../../admin.module';
import { CommonPackageModule } from 'src/app/common.package.module';
import { BasicsProfileComponent } from './basics-profile/basics-profile';
import { ProfileRoutingModule } from './profile.routing.module';
import { AccountSettingsComponent } from './account-settings/account-settings';
import { UserEmailComponent } from './account-settings/user-email/user-email';
import { UserPhoneComponent } from './account-settings/user-phone/user-phone';
import { UserPasswordComponent } from './account-settings/user-password/user-password';
import { UserNotificationsComponent } from './account-settings/user-notifications/user-notifications';
import { MembershipsComponent } from './memberships/memberships';
import { ProfileReservationsComponent } from './profile-reservations/profile-reservations';
import { ProfileCalendarComponent } from './profile-calendar/profile-calendar';
import { PaymentsInvoicesComponent } from './payments-invoices/payments-invoices';
import { TransactionTableComponent } from './payments-invoices/transaction-table/transaction-table';
import { InvoiceTableComponent } from './payments-invoices/invoice-table/invoice-table';
import { PaymentMethodsComponent } from './payments-invoices/payment-methods/payment-methods';
@NgModule({
    declarations: [
      BasicsProfileComponent,
      AccountSettingsComponent,
      UserEmailComponent,
      UserPhoneComponent,
      UserPasswordComponent,
      UserNotificationsComponent,
      MembershipsComponent,
      ProfileReservationsComponent,
      ProfileCalendarComponent,
      PaymentsInvoicesComponent,
      TransactionTableComponent,
      InvoiceTableComponent,
      PaymentMethodsComponent
    ],
    imports: [
      CommonModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      ProfileRoutingModule,
      AdminModule,
      CommonPackageModule,
    ],
    exports: [
      RouterModule,
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class ProfileModule { }
