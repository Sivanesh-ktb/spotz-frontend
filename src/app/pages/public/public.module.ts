import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { OrganizationViewComponent } from './organization-view/organization-view';
import { NavbarComponent } from '../includes/navbar/navbar.component';
import { CommonPackageModule } from 'src/app/common.package.module';
import { OrgViewHeaderComponent } from './includes/org-view-header/org-view-header';
import { OrgSliderComponent } from './includes/org-slider/org-slider';
import { HeaderComponent } from '../includes/header/header';
import { SpaceTypesComponent } from './space-types/space-types';
import { FacilityAndSpacesComponent } from './organization-view/facility-and-spaces/facility-and-spaces';
import { BookFacilityCardComponent } from './organization-view/book-facility-card/book-facility-card';
import { OrgAboutComponent } from './includes/org-about/org-about';
import { RulesAndPoliciesComponent } from './includes/rules-and-policies/rules-and-policies';
import { FooterComponent } from '../includes/footer/footer.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapComponent } from './includes/google-map/google-map';
import { PublicLayoutComponent } from './includes/public-layout/public-layout';
import { SpaceViewComponent } from './space-view/space-view';
import { FacilityViewComponent } from './facility-view/facility-view';
import { SpaceAvailabilityComponent } from './space-view/space-availability/space-availability';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpaceTypesDropDownComponent } from './drop-down/space-types/space-types';
import { SpaceActivityDropDownComponent } from './drop-down/space-activity/space-activity';
import { YearFilterComponent } from './drop-down/year-filter/year-filter';
import { MoreFilterComponent } from './drop-down/more-filter/more-filter';
import { SortByDistanceDropDownComponent } from './drop-down/sort-by-distance-drop-down/sort-by-distance-drop-down';
import { MilesDropDownComponent } from './drop-down/miles-drop-down/miles-drop-down';
import { SpaceGridTemplateComponent } from '../index/searchOrganizationFacility/space-grid-template/space-grid-template';
import { SpaceListTemplateComponent } from '../index/searchOrganizationFacility/space-list-template/space-list-template';
import { FacilitylistComponent } from '../index/facilitylist/facilitylist.component';
import { GoogleAutoCompleteComponent } from '../index/googleSearchAutoComplete/google-auto-complete';
import { AvailableFacLocationComponent } from '../index/searchOrganizationFacility/available-fac-location/available-fac-location';
import { PublicPaginationComponent } from './includes/public-pagination/public-pagination';
import { PaginatorModule } from 'primeng/paginator';
import { BookingPopupComponent } from './booking-popup/booking-popup';
import { BookingNavbarComponent } from './booking-popup/includes/booking-navbar/booking-navbar';
import { BookingHeaderComponent } from './booking-popup/includes/booking-header/booking-header';
import { BookingInfoComponent } from './booking-popup/booking-info/booking-info';
import { BookingInfoHeaderComponent } from './booking-popup/booking-info/booking-info-header/booking-info-header';
import { BookingInfoSpaceDetailsComponent } from './booking-popup/booking-info/booking-info-space-details/booking-info-space-details';
import { ListSpacesComponent } from './booking-popup/booking-info/booking-scheduler/list-spaces/list-spaces';
import { BookingSchedulerComponent } from './booking-popup/booking-info/booking-scheduler/booking-scheduler';
import { RecurringComponent } from './booking-popup/includes/recurring/recurring';
import { BookingScheduleComponent } from './booking-popup/booking-schedule/booking-schedule';
import { UpdateSearchComponent } from './booking-popup/booking-schedule/update-search/update-search';
import { BookingReceiptComponent } from './booking-popup/includes/booking-receipt/booking-receipt';
import { CalendarItemComponent } from './booking-popup/includes/calendar-item/calendar-item';
import { CalenderInfoComponent } from './booking-popup/includes/calender-info/calender-info';
import { BookingUsageDetailsComponent } from './booking-popup/booking-usage-details/booking-usage-details';
import { BookingFormComponent } from './booking-popup/booking-usage-details/booking-form/booking-form';
import { BookingOptionsComponent } from './booking-popup/booking-options/booking-options';
import { SetupOptionsComponent } from './booking-popup/booking-options/setup-options/setup-options';
import { VerifyBookingComponent } from './booking-popup/verify-booking/verify-booking';
import { VerifyBookingInfoComponent } from './booking-popup/verify-booking/verify-booking-info/verify-booking-info';
import { TermsOfRentalComponent } from './booking-popup/verify-booking/terms-of-rental/terms-of-rental';
import { HostTermsComponent } from '../index/host-terms/host-terms.component';
import { BookingDoneComponent } from './booking-popup/booking-done/booking-done';
import { BookingPaymentComponent } from './booking-popup/booking-payment/booking-payment';
import { NoAvailabilityComponent } from './booking-popup/includes/no-availability/no-availability';
import { CalendarBlockComponent } from './booking-popup/includes/calendar-block/calendar-block';
import { RepeatItemComponent } from './booking-popup/includes/repeat-item/repeat-item';
import { SingleItemComponent } from './booking-popup/includes/single-item/single-item';
import { DurationPipe, DurationStringPipe, LevelPipe, PhonePipe, PluralizePipe, TimeslotPipe, TimespanPipe } from 'src/app/utils/pipes';
import { InputMaskModule } from 'primeng/inputmask';
import { CancelingDataComponent } from './booking-popup/includes/canceling-data/canceling-data';
import {  PaymentMethodsComponent } from './booking-popup/booking-payment/paymentmethods/paymentmethods';
import { SpaceDetailsComponent } from './space-view/space-details/space-details';
import { AdminModule } from '../manage/admin.module';
import { FullCalendarModule } from '@fullcalendar/angular';
@NgModule({
  declarations: [
    OrganizationViewComponent,
    NavbarComponent,
    OrgViewHeaderComponent,
    OrgSliderComponent,
    HeaderComponent,
    SpaceTypesComponent,
    FacilityAndSpacesComponent,
    BookFacilityCardComponent,
    OrgAboutComponent,
    RulesAndPoliciesComponent,
    FooterComponent,
    GoogleMapComponent,
    PublicLayoutComponent,
    SpaceViewComponent,
    FacilityViewComponent,
    SpaceAvailabilityComponent,
    SpaceTypesDropDownComponent,
    SpaceActivityDropDownComponent,
    MoreFilterComponent,
    YearFilterComponent,
    SortByDistanceDropDownComponent,
    MilesDropDownComponent,
    SpaceGridTemplateComponent,
    SpaceListTemplateComponent,
    FacilitylistComponent,
    GoogleAutoCompleteComponent,
    AvailableFacLocationComponent,
    PublicPaginationComponent,
    BookingPopupComponent,
    BookingNavbarComponent,
    BookingHeaderComponent,
    BookingInfoComponent,
    BookingInfoHeaderComponent,
    BookingInfoSpaceDetailsComponent,
    ListSpacesComponent,
    BookingSchedulerComponent,
    RecurringComponent,
    BookingScheduleComponent,
    UpdateSearchComponent,
    BookingReceiptComponent,
    CalendarItemComponent,
    CalenderInfoComponent,
    BookingUsageDetailsComponent,
    BookingFormComponent,
    BookingOptionsComponent,
    SetupOptionsComponent,
    VerifyBookingComponent,
    VerifyBookingInfoComponent,
    TermsOfRentalComponent,
    HostTermsComponent,
    BookingDoneComponent,
    BookingPaymentComponent,
    NoAvailabilityComponent,
    CalendarBlockComponent,
    RepeatItemComponent,
    SingleItemComponent,
    TimeslotPipe,
    TimespanPipe,
    DurationStringPipe,
    DurationPipe,
    PluralizePipe,
    LevelPipe,
    CancelingDataComponent,
    PaymentMethodsComponent,
    PhonePipe,
    SpaceDetailsComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    CommonPackageModule,
    GoogleMapsModule,
    FormsModule,
    NgbModule,
    PaginatorModule,
    InputMaskModule,
    AdminModule,
    FullCalendarModule
  ],
  bootstrap:    [ OrgSliderComponent ],
  exports:
    [
      NavbarComponent,
      OrgViewHeaderComponent,
      OrgSliderComponent,
      HeaderComponent,
      SpaceTypesComponent,
      FooterComponent,
      OrgAboutComponent,
      RulesAndPoliciesComponent,
      GoogleMapComponent,
      SortByDistanceDropDownComponent,
      MilesDropDownComponent,
      MoreFilterComponent,
      SpaceTypesDropDownComponent,
      SpaceActivityDropDownComponent,
      SpaceGridTemplateComponent,
      SpaceListTemplateComponent,
      FacilitylistComponent,
      GoogleAutoCompleteComponent,
      AvailableFacLocationComponent,
      FacilityAndSpacesComponent,
      PublicPaginationComponent,
      BookingPopupComponent,
      BookingNavbarComponent,
      BookingHeaderComponent,
      BookingInfoSpaceDetailsComponent,
      ListSpacesComponent,
      BookingSchedulerComponent,
      RecurringComponent,
      BookingScheduleComponent,
      UpdateSearchComponent,
      BookingReceiptComponent,
      CalendarItemComponent,
      CalenderInfoComponent,
      VerifyBookingComponent,
      VerifyBookingInfoComponent,
      TermsOfRentalComponent,
      HostTermsComponent,
      BookingDoneComponent,
      BookingPaymentComponent
    ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class PublicModule { }
