import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OrgViewComponent } from '../../../pages/manage-orgs/organization/view/org-view';
import { OrgSettingsComponent } from '../../../pages/manage-orgs/organization/settings/org-setting';
import { OrgUsersComponent } from '../../../pages/manage-orgs/organization/users/org-users';
import { CreateOrgComponent } from '../organization/create-org/create-org';
import { AdminOrgSidebarComponent } from '../../../includes/admin-org-sidebar/admin-org-sidebar';
import { AdminModule } from '../../../admin.module';
import { OrganizationRoutingModule } from './organization.routing.module';
import { CommonPackageModule } from 'src/app/common.package.module';
import { OrgFacilitiesComponent } from './org-facilities/org-facilities';
import { ContactInformationComponent } from './contact-information/contact-information';
import { DeleteContactInformationComponent } from './contact-information/delete-contact-information/delete-contact-information';
import { OrgIntroductionComponent } from './view/org-introduction/org-introduction';
import { OrgGroupsComponent } from './view/org-groups/org-groups';
import { NavbarGroupMembersComponent } from './org-group-memberships/navbar-group-members/navbar-group-members';
import { ViewProfileMemberComponent } from './org-group-memberships/manage-users/view-profile-member/view-profile-member';
import { UpdateAccessMemberComponent } from './org-group-memberships/manage-users/update-access-member/update-access-member';
import { OrgGroupComponent } from './org-group-memberships/manage-group/org-group';
import { CustomGroupComponent } from './org-group-memberships/manage-group/custom-group/custom-group';
import { ImportGroupsComponent } from './org-group-memberships/manage-group/import-groups/import-groups';
import { GroupMembersComponent } from './org-group-memberships/manage-users/group-members/group-members';
import { ManageUsersComponent } from './org-group-memberships/manage-users/manage-users';
import { GroupAccessComponent } from './org-group-memberships/manage-users/group-access/group-access';
import { DeleteGroupMembersComponent } from './org-group-memberships/delete-group-members/delete-group-members';
import { OrgEventListUsageComponent } from '../org-event-list-usage/org-event-list-usage';
import { OrgTransactionsComponent } from './org-transactions/org-transactions';
import { UsersComponent } from './org-transactions/users/users';
import { TransactionsComponent } from './org-transactions/transactions/transactions';
import { DiscountedComponent } from './org-transactions/discounted/discounted';
import { IsPersonComponent } from './org-transactions/is-person/is-person';
import { OrgDepositsComponent } from './org-deposits/org-deposits';
import { PaidBookingComponent } from './org-deposits/paid-booking/paid-booking';
import { OfflinePaymentsComponent } from './org-deposits/offline-payments/offline-payments';
import { DiscountedDepositsComponent } from './org-deposits/discounted/discounted';
import { RefundedComponent } from './org-deposits/refunded/refunded';
import { AddOnsComponent } from './org-deposits/add-ons/add-ons';
import { InvoicesComponent } from './org-deposits/invoices/invoices';
import { OrgInvoicesComponent } from './org-inovices/org-invoices';
import { CreateInvoiceComponent } from './org-inovices/create-invoice/create-invoice';
import { OrgUsageComponent } from './org-usage/org-usage';
import { CancelReservationsComponent } from './cancel-reservations/cancel-reservations';
import { OrgInboxComponent } from './org-inbox/org-inbox';
import { OrgEventListComponent } from './org-event-list/org-event-list';
import { InputMaskModule } from 'primeng/inputmask';
import { PricingToolComponent } from './settings/pricing-tool/pricing-tool';
import { BasicsSettingComponent } from './settings/basics-setting/basics-setting';
import { ReservationsComponent } from './settings/reservations/reservations';
import { ExampleTemplateComponent } from './settings/pricing-tool/example-template/example-template';
import { OrgViewSettingsComponent } from './view/org-view-settings/org-view-settings';
import { TaxInfoComponent } from './settings/basics-setting/tax-info/tax-info';
import { LeadTimeComponent } from './settings/reservations/lead-time/lead-time';
import { RulesAttachmentComponent } from './settings/reservations/rules/rules-attachment';
import { RepliesComponent } from './settings/reservations/replies/replies';
import { PublicEventsComponent } from './settings/reservations/public-events/public-events';
import { RepliesConfirmationComponent } from './settings/reservations/replies/replies-confirmation/replies-confirmation';
import { SalesTaxComponent } from './settings/basics-setting/sales-tax/sales-tax';
import { PayoutMethodsComponent } from './settings/basics-setting/payout-methods/payout-methods';
import { TransactionFeesComponent } from './settings/basics-setting/transaction-fees/transaction-fees';
import { SendEmailNotificationsComponent } from './settings/basics-setting/send-email-notifications/send-email-notifications';
import { SpotzServiceFeeComponent } from './settings/basics-setting/spotz-service-fee/spotz-service-fee';
import { TagsComponent } from './settings/basics-setting/tag/tag';
import { InsuranceSettingsComponent } from './settings/basics-setting/insurabce-settings/insurance-settings';
import { AgePipe } from 'src/app/utils/pipes';
import { EmbedWidgetComponent } from './view/embed-widget/embed-widget.component';
import { BookingLineGroupedComponent } from './org-inbox/booking-line-grouped/booking-line-grouped';
import { BookingDetailsComponent } from '../booking-request-popup/booking-details/booking-details';
import { BookingRequestPopupComponent } from '../booking-request-popup/booking-request-popup';
import { BookingPaymentInfoComponent } from '../booking-request-popup/booking-payment-info/booking-payment-info';
import { BookingMessageComponent } from '../booking-request-popup/booking-message/booking-message';
import { BookingCardDetailsComponent } from '../booking-request-popup/booking-card-details/booking-card-details';
import { BookingTransactionHistoryComponent } from '../booking-request-popup/booking-transaction-history/booking-transaction-history';
import { ReservationsPrintComponent } from '../booking-request-popup/reservations-print/reservations-print';

@NgModule({
    declarations: [
      OrgViewComponent,
      OrgSettingsComponent,
      OrgUsersComponent,
      GroupMembersComponent,
      NavbarGroupMembersComponent,
      ViewProfileMemberComponent,
      UpdateAccessMemberComponent,
      AdminOrgSidebarComponent,
      CreateOrgComponent,
      OrgFacilitiesComponent,
      ContactInformationComponent,
      DeleteContactInformationComponent,
      OrgIntroductionComponent,
      OrgGroupsComponent,
      OrgGroupComponent,
      CustomGroupComponent,
      ImportGroupsComponent,
      ManageUsersComponent,
      GroupAccessComponent,
      DeleteGroupMembersComponent,
      OrgEventListUsageComponent,
      OrgTransactionsComponent,
      UsersComponent,
      TransactionsComponent,
      DiscountedComponent,
      IsPersonComponent,
      OrgDepositsComponent,
      PaidBookingComponent,
      OfflinePaymentsComponent,
      DiscountedDepositsComponent,
      RefundedComponent,
      AddOnsComponent,
      InvoicesComponent,
      OrgInvoicesComponent,
      CreateInvoiceComponent,
      OrgUsageComponent,
      CancelReservationsComponent,
      OrgInboxComponent,
      OrgEventListComponent,
      PricingToolComponent,
      BasicsSettingComponent,
      ReservationsComponent,
      ExampleTemplateComponent,
      OrgViewSettingsComponent,
      TaxInfoComponent,
       LeadTimeComponent,
      RulesAttachmentComponent,
      RepliesComponent,
      PublicEventsComponent,
      RepliesConfirmationComponent,
      TransactionFeesComponent,
      SendEmailNotificationsComponent,
      SpotzServiceFeeComponent,
      SalesTaxComponent,
      PayoutMethodsComponent,
      SendEmailNotificationsComponent,
      SpotzServiceFeeComponent,
      SalesTaxComponent,
      PayoutMethodsComponent,
      TagsComponent,
      InsuranceSettingsComponent,
      AgePipe,
      EmbedWidgetComponent,
      BookingLineGroupedComponent,
      BookingRequestPopupComponent,
      BookingDetailsComponent,
      BookingPaymentInfoComponent,
      BookingMessageComponent,
      BookingCardDetailsComponent,
      BookingTransactionHistoryComponent,
      ReservationsPrintComponent
    ],
    imports: [
      CommonModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      OrganizationRoutingModule,
      AdminModule,
      CommonPackageModule,
      InputMaskModule
    ],
    exports: [
      RouterModule,
      NavbarGroupMembersComponent,
      ManageUsersComponent,
      BookingLineGroupedComponent,
      BookingRequestPopupComponent,
      BookingDetailsComponent
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ],

})
export class OrganizationModule { }
