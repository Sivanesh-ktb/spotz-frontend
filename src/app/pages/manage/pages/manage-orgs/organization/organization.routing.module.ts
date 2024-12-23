import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateOrgComponent } from '../organization/create-org/create-org';
import { OrgViewComponent } from '../organization/view/org-view';
import { OrgSettingsComponent } from '../organization/settings/org-setting';
import { OrgUsersComponent } from '../organization/users/org-users';
import { OrgFacilitiesComponent } from './org-facilities/org-facilities';
import { ContactInformationComponent } from './contact-information/contact-information';
import { OrgGroupComponent } from './org-group-memberships/manage-group/org-group';
import { ManageUsersComponent } from './org-group-memberships/manage-users/manage-users';
import { OrgEventListUsageComponent } from '../org-event-list-usage/org-event-list-usage';
import { OrgTransactionsComponent } from './org-transactions/org-transactions';
import { OrgDepositsComponent } from './org-deposits/org-deposits';
import { OrgInvoicesComponent } from './org-inovices/org-invoices';
import { CancelReservationsComponent } from './cancel-reservations/cancel-reservations';
import { OrgInboxComponent } from './org-inbox/org-inbox';
import { USER_ROLES } from 'src/app/models/enums';
import { AuthGuard } from 'src/app/auth.guard';
import { EmbedWidgetComponent } from './view/embed-widget/embed-widget.component';
const routes: Routes = [
{
    path:'orgs/new',
    component:CreateOrgComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
  {
    path:'orgs/edit/:orgId',
    component:CreateOrgComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
  {
    path:"manage/org/:orgId",
    component:OrgViewComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/settings',
    component:OrgSettingsComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/users',
    component:OrgUsersComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
  {
    path:'manage/org/:orgId/groups/:groupId',
    component:ManageUsersComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
  {
    path:'manage/org/:orgId/facs',
    component:OrgFacilitiesComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/contacts',
    component:ContactInformationComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/groups',
    component:OrgGroupComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
  {
    path:'manage/org/:orgId/new/group',
    component:OrgGroupComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
  {
    path:'manage/org/:orgId/eventlist',
    component:OrgEventListUsageComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/transactions',
    component: OrgTransactionsComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/deposits',
    component:OrgDepositsComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/invoices',
    component:OrgInvoicesComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/usage',
    component:OrgEventListUsageComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/schedule',
    component:OrgEventListUsageComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/cancel',
    component:CancelReservationsComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'manage/org/:orgId/inbox',
    component:OrgInboxComponent,
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin, USER_ROLES.approver, USER_ROLES.editor,
        USER_ROLES.maintenanceManager,USER_ROLES.maintenanceStaff
      ]
    }
  },
  {
    path:'widget/org/:orgId',
    component:EmbedWidgetComponent,
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
export class OrganizationRoutingModule { }
