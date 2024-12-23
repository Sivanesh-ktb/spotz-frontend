import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { manageRoutes } from 'src/app/models/enums';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.css']
})
export class ProfileSidebarComponent implements OnInit {
  currentRoute = '';
constructor(
  private router : Router,
  private viewPortScroller : ViewportScroller
)
{
  this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      this.currentRoute = this.getCurrentPageUrl(event.urlAfterRedirects);
       }
  });
}
ngOnInit(){
this.currentRoute = this.getCurrentPageUrl(this.router.url);
}
viewProfile(){
  this.router.navigate([manageRoutes.BASICS_PROFILE]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
viewSettings(){
  this.router.navigate([manageRoutes.ACCOUNT_SETTINGS]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
viewMemberships(){
  this.router.navigate([manageRoutes.MEMBERSHIPS]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
viewReservations(){
  this.router.navigate([manageRoutes.RESERVATIONS]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
viewCalendar(){
  this.router.navigate([manageRoutes.CALENDAR]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
viewPayments(){
  this.router.navigate([manageRoutes.PAYMENTS]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
getCurrentPageUrl(url: string): string {
  if(url.includes('profile')){
    return 'profile';
  }
  else if(url.includes('settings')){
    return 'settings';
  }
  else if(url.includes('memberships')){
    return 'memberships';
  }
  else if(url.includes('reservations')){
    return 'reservations';
  }
  else if(url.includes('payments')){
    return 'payments';
  }
  else if(url.includes('calendar')){
    return 'calendar';
  }
  else{
    return '';
}
}
}
