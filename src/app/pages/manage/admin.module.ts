import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { Helpers } from 'src/app/helpers/helper';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppNavbarComponent } from './includes/admin-navbar/admin-navbar';
import { AppFooterComponent } from './includes/admin-footer/admin-footer';
import { CommonPackageModule } from 'src/app/common.package.module';
import { DeleteManageOrganizationComponent } from './pages/manage-orgs/delete-manage-organization/delete-manage-organization.component';
import { NewGroupComponent } from './pages/manage-orgs/organization/org-group-memberships/manage-group/new-group/new-group';
import { DateRangePickerComponent } from './includes/date-range-picker/date-range-picker';
import { NgxDaterangepickerLocaleService } from 'ngx-daterangepicker-bootstrap';
import { FacilityDropDownComponent } from './pages/manage-orgs/drop-downs/facility-drop-down/facility-drop-down';
import { SpaceTypeDropDownComponent } from './pages/manage-orgs/drop-downs/space-type-drop-down/space-type-drop-down';
import { BookingStatusDropDownComponent } from './pages/manage-orgs/drop-downs/booking-status-drop-down/booking-status-drop-down';
import { SportActivityDropDownComponent } from './pages/manage-orgs/drop-downs/sport-activity-drop-down/sport-activity-drop-down';
import { AttendanceDropDownComponent } from './pages/manage-orgs/drop-downs/attendance-drop-down/attendance-drop-down';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CustomGroupDropDownComponent } from './pages/manage-orgs/drop-downs/custom-group-drop-down/custom-group-drop-down';
import { ToBeInvoicedComponent } from './pages/manage-orgs/organization/org-inovices/create-invoice/to-be-invoiced/to-be-invoiced';
import { InvoiceDiscountedComponent } from './pages/manage-orgs/organization/org-inovices/create-invoice/invoice-discounted/invoice-discounted';
import { FilterInvoiceComponent } from './pages/manage-orgs/organization/org-inovices/filter-invoice/filter-invoice';
import { OriginDropDownComponent } from './pages/manage-orgs/drop-downs/origin-drop-down/origin-drop-down';
import { OrgReservationComponent } from './pages/manage-orgs/organization/org-reservation/org-reservation';
import { OrgEventComponent } from './pages/manage-orgs/org-event/org-event';
import { AdminFacSidebarComponent } from './includes/admin-fac-sidebar/admin-fac-sidebar';
import { FacEventsComponent } from './pages/manage-orgs/facility/fac-events/fac-events';
import { OrgCalendarFilterComponent } from './pages/manage-orgs/org-calendar-filter/org-calendar-filter';
import { AdminSpaceSidebarComponent } from './includes/admin-space-sidebar/admin-space-sidebar';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { WeekCalendarTableComponent } from './pages/manage-orgs/org-calendar-filter/week-calendar-tabe/week-calendar-tabe';
import { MonthCalendarTableComponent } from './pages/manage-orgs/org-calendar-filter/month-calendar-table/month-calendar-table';
import { DayCalendarTableComponent } from './pages/manage-orgs/org-calendar-filter/day-calendar-table/day-calendar-table';
import { AgendaComponent } from './pages/manage-orgs/org-calendar-filter/agenda/agenda';
import { PaginationComponent } from '../includes/pagination/pagination.component';
import { DatepickerComponent } from '../includes/datepicker/datepicker.component';
import { DayDropDownComponent } from './pages/manage-orgs/drop-downs/day-drop-down/day-drop-down';
import { PriorityDropDownComponent } from './pages/manage-orgs/drop-downs/priority-drop-down/priority-drop-down';
import { AddonComponent } from './pages/addon/addon.component';
import { AddonDeleteComponent } from './pages/addon-delete/addon-delete.component';
import { CalendarComponent } from './pages/calendar/calendar';
import { PriorityBoxesComponent } from './pages/priority-boxes/priority-boxes';
import { RegionComponent } from './pages/region/region.component';
import { DaysComponent } from './pages/days/days';
import { ProfileSidebarComponent } from './pages/profile/profile-sidebar/profile-sidebar.component';
import { SpaceEventComponent } from './pages/manage-orgs/space/space-event/space-event';
import { IncidentsComponent } from './pages/incidents/incidents';
import { TemplateDropDownComponent } from './pages/manage-orgs/drop-downs/template-drop-down/template-drop-down';
import { ConfirmationPopupComponent } from './pages/manage-orgs/space/space-settings/confirmation-popup/confirmation-popup';
import { TimeDropDownComponent } from './pages/manage-orgs/time-block-template/time-drop-down/time-drop-down';
import { AdditionalTimeComponent } from './pages/manage-orgs/time-block-template/additional-time/additional-time';
import { TimeBlockTemplateComponent } from './pages/manage-orgs/time-block-template/time-block-template';
import { OrgAddDepositsComponent } from './includes/org-deposits/org-add-deposits';
@NgModule({
  declarations: [
    AdminDashboardComponent,
    AppNavbarComponent,
    AppFooterComponent,
    DeleteManageOrganizationComponent,
    NewGroupComponent,
    DateRangePickerComponent,
    FacilityDropDownComponent,
    SpaceTypeDropDownComponent,
    BookingStatusDropDownComponent,
    SportActivityDropDownComponent,
    AttendanceDropDownComponent,
    CustomGroupDropDownComponent,
    ToBeInvoicedComponent,
    InvoiceDiscountedComponent,
    FilterInvoiceComponent,
    OriginDropDownComponent,
    OrgReservationComponent,
    OrgEventComponent,
    AdminFacSidebarComponent,
    FacEventsComponent,
    OrgCalendarFilterComponent,
    AdminSpaceSidebarComponent,
    WeekCalendarTableComponent,
    MonthCalendarTableComponent,
    DayCalendarTableComponent,
    AgendaComponent,
    PaginationComponent,
    DatepickerComponent,
    DayDropDownComponent,
    PriorityDropDownComponent,
    AddonComponent,
    AddonDeleteComponent,
    CalendarComponent,
    PriorityBoxesComponent,
    RegionComponent,
    DaysComponent,
    ProfileSidebarComponent,
    SpaceEventComponent,
    IncidentsComponent,
    TemplateDropDownComponent,
    TimeDropDownComponent,
    AdditionalTimeComponent,
    ConfirmationPopupComponent,
    TimeBlockTemplateComponent,
    OrgAddDepositsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CommonPackageModule,
    CalendarModule,
    FormsModule,
    NgbDatepickerModule,
    NgxDaterangepickerMd.forRoot()
  ],
  exports: [
    AppNavbarComponent,
    AppFooterComponent,
    NewGroupComponent,
    DateRangePickerComponent,
    FacilityDropDownComponent,
    SpaceTypeDropDownComponent,
    BookingStatusDropDownComponent,
    SportActivityDropDownComponent,
    AttendanceDropDownComponent,
    CustomGroupDropDownComponent,
    ToBeInvoicedComponent,
    InvoiceDiscountedComponent,
    FilterInvoiceComponent,
    OriginDropDownComponent,
    OrgReservationComponent,
    OrgEventComponent,
    AdminFacSidebarComponent,
    FacEventsComponent,
    OrgCalendarFilterComponent,
    AdminSpaceSidebarComponent,
    PaginationComponent,
    DatepickerComponent,
    DayDropDownComponent,
    PriorityDropDownComponent,
    CalendarComponent,
    PriorityBoxesComponent,
    DaysComponent,
    ProfileSidebarComponent,
    SpaceEventComponent,
    IncidentsComponent,
    TemplateDropDownComponent,
    ConfirmationPopupComponent,
    TimeBlockTemplateComponent,
    OrgAddDepositsComponent,
  ],
  providers: [
    Helpers,
    ConfirmationService,
    MessageService,
    NgxDaterangepickerLocaleService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
