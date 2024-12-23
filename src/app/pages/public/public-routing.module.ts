import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationViewComponent } from './organization-view/organization-view';
import { PublicLayoutComponent } from './includes/public-layout/public-layout';
import { FacilityViewComponent } from './facility-view/facility-view';
import { SpaceViewComponent } from './space-view/space-view';

const routes: Routes = [
  {
    path:'',
    component:PublicLayoutComponent,
    children:[
    {
     path:':state/:city/orgs/:orgName',
    component: OrganizationViewComponent
    },
    {
      path: ':state/:city/orgs/:orgName/facilities/:facName',
      component:FacilityViewComponent
    },
    {
      path:':state/:city/orgs/:orgName/facilities/:facName/:spaceId',
      component:SpaceViewComponent
    },
]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
