import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateSpaceComponent } from '../space/create-space/create-space';
import { ViewSpaceComponent } from '../space/view-space/view-space';
import { SpaceSettingsComponent } from '../space/space-settings/space-settings';
import { SpacePhotosComponent } from '../space/space-photos/space-photos';
import { OrgEventListUsageComponent } from '../org-event-list-usage/org-event-list-usage';
import { SpaceCalendarComponent } from './space-calendar/space-calendar';
import { SpaceAvailabilityComponent } from './space-availability/space-availability';
import { AuthGuard } from 'src/app/auth.guard';
import { USER_ROLES } from 'src/app/models/enums';

const routes: Routes = [
{
    path:'manage/org/:orgId/facility/:facilityId/space/new',
    component:CreateSpaceComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId/space/:spaceId',
    component:ViewSpaceComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId/space/edit/:spaceId',
    component:CreateSpaceComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId/space/:spaceId/settings',
    component:SpaceSettingsComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId/space/:spaceId/photos',
    component: SpacePhotosComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId/space/:spaceId/reservations',
    component:OrgEventListUsageComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId/space/:spaceId/calendar',
    component:SpaceCalendarComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/facility/:facilityId/space/:spaceId/availability',
    component:SpaceAvailabilityComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpaceRoutingModule { }
