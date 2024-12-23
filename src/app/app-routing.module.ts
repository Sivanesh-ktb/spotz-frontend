import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchMapComponent } from './pages/index/searchMap/searchMap.component';
import { SearchOrgFacComponent } from './pages/index/searchOrganizationFacility/searchOrgFac';
import { CreateOrgComponent } from './pages/manage/pages/manage-orgs/organization/create-org/create-org';
import { PrivacyComponent } from './pages/index/privacy/privacy.component';
import { HostTermsComponent } from './pages/index/host-terms/host-terms.component';
import { HourslyRentalComponent } from './pages/index/hoursly-rental/hoursly-rental.component';
import { WaiverComponent } from './pages/index/waiver/waiver.component';
import { TermsConditionsComponent } from './pages/index/terms-conditions/terms-conditions.component';
import { AdminLayoutComponent } from './pages/manage/admin-layout/admin-layout';
import { USER_ROLES } from './models/enums';
import { AuthGuard } from './auth.guard';
import { ReservationsPrintComponent } from './pages/manage/pages/manage-orgs/booking-request-popup/reservations-print/reservations-print';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: RegisterComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'search',
    component: SearchMapComponent
  },
  {
    path:'search/org/fac',
    component: SearchOrgFacComponent
  },
  {
    path:'manage/orgs/new',
    component:CreateOrgComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
  {
    path: 'terms',
    component: TermsConditionsComponent
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'host',
    component: HostTermsComponent
  },
  {
    path:'hoursly',
    component:HourslyRentalComponent
  },
  {
    path: 'forms/waiver',
    component:WaiverComponent
  },
  {
    path:'',
    component:AdminLayoutComponent,
    children:[
      {
          path: 'manage', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
      }]
  },
  {
    path:'',
    component:AdminLayoutComponent,
    children:[
      {
        path:'admin',
        loadChildren: () => import('./pages/manage/admin.module').then(m => m.AdminModule),

      },
      {
        path:'admin',
        loadChildren: () => import('./pages/manage/pages/manage-orgs/organization/organization.module').then(m => m.OrganizationModule),
      },
      {
        path:'admin',
        loadChildren: () => import('./pages/manage/pages/manage-orgs/facility/facility.module').then(m => m.FacilityModule),
      },
      {
        path:'admin',
        loadChildren: () => import('./pages/manage/pages/manage-orgs/space/space.module').then(m => m.SpaceModule),
      },
      {
        path:'manage/account',
        loadChildren: () => import('./pages/manage/pages/profile/profile.module').then(m => m.ProfileModule),
      },
 ]
},
{
    path:'',
    loadChildren:()=>import('./pages/public/public.module').then(m=>m.PublicModule),
  },
  {
    path:'reservations/print/:resId',
    component:ReservationsPrintComponent,
    canActivate: [AuthGuard],
    data: {
      authorizedRoles: [USER_ROLES.superadmin,USER_ROLES.admin]
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

