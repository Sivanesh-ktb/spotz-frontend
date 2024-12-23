import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CreateFacilityComponent } from '../facility/create-facility/create-facility';
import { ViewFacilityComponent } from '../facility/view-facility/view-facility';
import { FacilityRoutingModule } from './facility.routing.module';
import { AdminModule } from '../../../admin.module';
import { CommonPackageModule } from 'src/app/common.package.module';
import { FacSpacesComponent } from './fac-spaces/fac-spaces';
import { FacilityUploadMapComponent } from './view-facility/facility-upload-map/facility-upload-map';
import { GeneralHoursComponent } from './view-facility/general-hours/general-hours';
import { FacMapComponent } from './fac-map/fac-map';
import { GoogleMapsModule } from '@angular/google-maps';
import { FacMapConfirmationPopupComponent } from './fac-map/fac-map-confirmation-popup/fac-map-confirmation-popup';
import { MarkerInfoComponent } from './fac-map/marker-info/marker-info';
import { FacCalendarComponent } from './fac-calendar/fac-calendar';

@NgModule({
  declarations: [
    CreateFacilityComponent,
    ViewFacilityComponent,
    FacSpacesComponent,
    FacilityUploadMapComponent,
    GeneralHoursComponent,
    FacMapComponent,
    FacMapConfirmationPopupComponent,
    MarkerInfoComponent,
    FacCalendarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AdminModule,
    ReactiveFormsModule,
    FacilityRoutingModule,
    CommonPackageModule,
    GoogleMapsModule
    ],
  exports: [

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class FacilityModule { }
