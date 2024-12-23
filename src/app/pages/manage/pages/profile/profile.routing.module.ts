import { NgModule } from "@angular/core";
import { BasicsProfileComponent } from "./basics-profile/basics-profile";
import { RouterModule, Routes } from "@angular/router";
import { AccountSettingsComponent } from "./account-settings/account-settings";
import { MembershipsComponent } from "./memberships/memberships";
import { OrgEventListUsageComponent } from "../manage-orgs/org-event-list-usage/org-event-list-usage";
import { ProfileCalendarComponent } from "./profile-calendar/profile-calendar";
import { PaymentsInvoicesComponent } from "./payments-invoices/payments-invoices";


const routes: Routes = [
  {
    path:'profile',
    component: BasicsProfileComponent
  },
  {
    path:'settings',
    component: AccountSettingsComponent
  },
  {
    path:'memberships',
    component:MembershipsComponent
  },
  {
    path:'reservations',
    component:OrgEventListUsageComponent
  },
  {
    path:'calendar',
    component:ProfileCalendarComponent
  },
  {
    path:'payments',
    component:PaymentsInvoicesComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }





