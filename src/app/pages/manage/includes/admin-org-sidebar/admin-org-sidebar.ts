
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { DeleteManageOrganizationComponent } from '../../pages/manage-orgs/delete-manage-organization/delete-manage-organization.component';
import { ViewportScroller } from '@angular/common';
import { ManageOrgService } from 'src/app/services/manage-org.service';
import { ToastrService } from 'ngx-toastr';
import { loginRoutes } from 'src/app/models/enums';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-admin-org-sidebar',
  templateUrl: './admin-org-sidebar.html',
  styleUrls: ['./admin-org-sidebar.css']
})

export class AdminOrgSidebarComponent implements OnInit {

  orgId  = '';
  @Input() orgName  = '';
  @Input() viewOrgPage!:boolean;
  city='';
  state = '';
  currentRoute = '';
  facId='';
  orgDetails: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private viewPortScroller: ViewportScroller,
    private manageOrgService: ManageOrgService,
    private toastr: ToastrService,
    private authService: AuthService,
    private commonService: CommonService
  ){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.getCurrentRouteFromUrl(event.urlAfterRedirects);
         }
    });
  }
  ngOnInit(){
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId')??'';
      this.facId = paramMap.get('facilityId')??'';
      this.currentRoute = this.getCurrentRouteFromUrl(this.router.url);
      if(this.orgId){
        this.getOrganizationDetails();
      }
    });
  }
  getOrganizationDetails(){
    this.manageOrgService.getViewOrgDetails(this.orgId).subscribe(
      (response: any) => {
        if (response.status === 200) {
              this.orgDetails = response.body;
              this.orgName = this.orgDetails.name;
              this.city = this.orgDetails?.address?.city;
              this.state = this.orgDetails?.address?.state;
        } else {
          this.toastr.error(response.body.message);
        }
      },
      (error) => {
        if(error.status === 401){
          this.authService.authLogout();
          this.router.navigate([loginRoutes.LOGIN]);
        }
        else{
          this.toastr.error(error.message);
        }
      }
    );
  }
  viewOrg(){
    if(this.orgId){
    this.router.navigate([`/admin/manage/org/${this.orgId}`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewSetting(){
    if(this.orgId){
    this.router.navigate([`/admin/manage/org/${this.orgId}/settings`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewUsers(){
    if(this.orgId){
     this.router.navigate([`admin/manage/org/${this.orgId}/users`]);
     return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  deleteOrgManage(){
    this.dialog.open(DeleteManageOrganizationComponent,{
      width:'400px',
      data:{
        orgId: this.orgId,
        displayName:this.orgName,
        facName:this.orgName
        }
    });
  }
  editGroups(){
    if(this.orgId){
    this.router.navigate([`admin/manage/org/${this.orgId}/groups`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewEventList(){
    if(this.orgId){
    this.router.navigate([`admin/manage/org/${this.orgId}/eventlist`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewTransactions(){
    if(this.orgId){
    this.router.navigate([`admin/manage/org/${this.orgId}/transactions`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewDeposits(){
    if(this.orgId){
    this.router.navigate([`admin/manage/org/${this.orgId}/deposits`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewInvoices(){
    if(this.orgId){
    this.router.navigate([`admin/manage/org/${this.orgId}/invoices`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewUsage(){
    if(this.orgId){
    this.router.navigate([`admin/manage/org/${this.orgId}/usage`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewEvents(){
    if(this.orgId){
    this.router.navigate([`admin/manage/org/${this.orgId}/schedule`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewCancelReservations(){
    if(this.orgId){
    this.router.navigate([`admin/manage/org/${this.orgId}/cancel`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewInbox(){
    if(this.orgId){
    this.router.navigate([`admin/manage/org/${this.orgId}/inbox`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewOrganization() {
    const url = `/${this.commonService.removeEmptySpaces(this.state)}/${this.commonService.removeEmptySpaces(this.city)}/orgs/${this.orgDetails?.shortName}`;
    const newTab = window.open(url, '_blank');
    if (newTab) {
        newTab.onload = function() {
        newTab.scrollTo(0, 0);
      };
    }
  }

  getCurrentRouteFromUrl(url: string): string {
    if(!this.facId){
    if (url.includes('settings')) {
      return 'settings';
    } else if (url.includes('groups')) {
      return 'groups';
    }
    else if(url.includes('eventlist')){
      return 'event';
    }
    else if(url.includes('transactions')){
      return 'transactions';
    }
    else if(url.includes('deposits')){
      return 'deposits';
    }
    else if(url.includes('invoices')){
      return 'invoices';
    }
    else if(url.includes('users')){
      return 'users';
    }
    else if(url.includes('usage')){
      return 'usage';
    }
    else if(url.includes('schedule')){
      return 'schedule';
    }
    else if(url.includes('cancel')){
      return 'cancel';
    }
    else if(url.includes('inbox')){
      return 'inbox';
    }
    else if(url.includes('/manage/org/'))
    {
      return 'viewOrg';
    }
  }
    return '';

  }
}
