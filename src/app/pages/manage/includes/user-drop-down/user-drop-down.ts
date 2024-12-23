import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { adminRoutes, loginRoutes, manageRoutes } from 'src/app/models/enums';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-drop-down',
  templateUrl: './user-drop-down.html',
  styleUrls: ['./user-drop-down.css']
})
export class UserDropDownComponent implements OnInit {

  constructor( private authService: AuthService,
    private router: Router,
    private viewPortScroller: ViewportScroller,
    private authGuardService: AuthGuardService
  ){

  }
  userEmail='';
  superAdmin = false;
  dashboardUrl!: string;
  viewReservationsUrl!: string;
  viewInvoicesUrl!: string;
  viewProfileUrl!: string;
  viewAccountUrl!: string;
  viewMembershipsUrl!: string;
  profilePageUrl=manageRoutes.BASICS_PROFILE;
  dashboardPageUrl=adminRoutes.ADMIN_DASHBOARD;
  reservationsPageUrl=manageRoutes.RESERVATIONS;
  paymentsPageUrl=manageRoutes.PAYMENTS;
  accountSettingsPageUrl=manageRoutes.ACCOUNT_SETTINGS;
  membershipsPageUrl=manageRoutes.MEMBERSHIPS;


  ngOnInit(){
     if(localStorage.getItem('role') == environment.superAdminRole){
      this.dashboardUrl = this.router.serializeUrl(this.router.createUrlTree([adminRoutes.ADMIN_DASHBOARD]));
     }
     else{
      this.dashboardUrl = this.router.serializeUrl(this.router.createUrlTree([adminRoutes.USER_DASHBOARD]));
     }
    this.viewReservationsUrl = this.router.serializeUrl(this.router.createUrlTree([manageRoutes.RESERVATIONS]));
    this.viewInvoicesUrl = this.router.serializeUrl(this.router.createUrlTree([manageRoutes.PAYMENTS]));
    this.viewProfileUrl = this.router.serializeUrl(this.router.createUrlTree([manageRoutes.BASICS_PROFILE]));
    this.viewAccountUrl = this.router.serializeUrl(this.router.createUrlTree([manageRoutes.ACCOUNT_SETTINGS]));
    this.viewMembershipsUrl = this.router.serializeUrl(this.router.createUrlTree([manageRoutes.MEMBERSHIPS]));
    const email = localStorage.getItem('email') ?? '';
    if(email){
      this.userEmail = email;
    }
  }
  viewPage(event: MouseEvent,pageUrl:string): void {
    if (event.ctrlKey || event.metaKey || event.button === 1) {
      return;
    } else {
      event.preventDefault();
      this.router.navigate([pageUrl]);
      this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  logout(): void {
    this.authService.authLogout();
    this.router.navigate([loginRoutes.LOGIN]);
  }
}
