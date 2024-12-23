import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateFacilityComponent } from '../facility/create-facility/create-facility';
import { ViewFacilityComponent } from '../facility/view-facility/view-facility';
import { FacSpacesComponent } from './fac-spaces/fac-spaces';
import { OrgEventListUsageComponent } from '../org-event-list-usage/org-event-list-usage';
import { FacMapComponent } from './fac-map/fac-map';
import { FacCalendarComponent } from './fac-calendar/fac-calendar';
import { AuthGuard } from 'src/app/auth.guard';
import { USER_ROLES } from 'src/app/models/enums';



const routes: Routes = [
  {
    path:'manage/org/:orgId/facility/new',
    component:CreateFacilityComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
  {
    path:'manage/org/:orgId/facility/edit/:facilityId',
    component:CreateFacilityComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId',
    component:ViewFacilityComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId/spaces',
    component:FacSpacesComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId/reservations',
    component:OrgEventListUsageComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId/map',
    component:FacMapComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId/calendar',
    component:FacCalendarComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityRoutingModule { }

