
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { AddonComponent } from './pages/addon/addon.component';
import { RegionComponent } from './pages/region/region.component';
import { IncidentsComponent } from './pages/incidents/incidents';
import { AuthGuard } from 'src/app/auth.guard';
import { USER_ROLES } from 'src/app/models/enums';
const routes: Routes = [
  {
    path: 'home/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin]
    }
  },
  {
    path: 'addons',
    component: AddonComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin]
    }
  },
  {
    path: 'regions',
    component: RegionComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin]
    }
  },
  {
    path:'incidents',
    component:IncidentsComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin]
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
