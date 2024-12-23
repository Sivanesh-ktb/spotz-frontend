

import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { adminRoutes, loginRoutes, manageRoutes } from "src/app/models/enums";
import { CreateOrgComponentService } from "src/app/services/create-org.service";
import { facilityList } from "src/app/models/facility";
import { ToastrService } from "ngx-toastr";
import { FacilityService } from "src/app/services/facility.service";
import { spaceList } from "src/app/models/space";
import { ViewportScroller } from "@angular/common";
import { SearchOrgFacService } from "src/app/services/search-org-fac.service";
import { ManageOrgService } from "src/app/services/manage-org.service";
import { AppConst } from "src/app/app.const";
import { CommonService } from "src/app/services/common.service";
import { AuthGuardService } from "src/app/services/auth-guard.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.html',
  styleUrls: ['./admin-navbar.css'
  ]
})
export class AppNavbarComponent implements OnChanges, OnInit {
  successMessage = '';
  orgId  = '';
  facilityName  = '';
  spaceName  = '';
  facId  = '';
  spaceId  = '';
  @Input() imageUrl !: string;
  @Input() userProfileName !: string;
  noFacilityName  = '';
  noSpaceName  = '';
  facilities : facilityList[] = [];
  spaceDetails : spaceList[] = [];
  orgDetails : any;
  userEmail = '';
  userName='';
  orgName='';
  orgIdCheck = '';
  userImage = '';
  supportLink= this.appConst.support_link;
  activeColumn = 0;
  logo = this.appConst.logo_url;
  superAdmin = false;
  userOrgDetails : any;
  isDropdownOpen = false;
  userOrgList = false;
  constructor(private authService: AuthService,
    private router: Router,
    private route:ActivatedRoute,
    private createOrgService : CreateOrgComponentService,
    private toastr : ToastrService,
    private facilityService : FacilityService,
    private viewPortScroller: ViewportScroller,
    private searchOrgFacService: SearchOrgFacService,
    private manageOrgService:ManageOrgService,
    private appConst : AppConst,
    private authGuardService: AuthGuardService,
    private commonService: CommonService
  ){

  }
  ngOnChanges() {
      if(this.imageUrl){
        this.userImage =this.imageUrl;
       }
      if(this.userProfileName){
        this.userName = this.userProfileName;
       }
  }
  ngOnInit(): void{
    this.authLoginMessage();
    this.removeMessage();
    this.getUserOrgDetails();
    this.userName = localStorage.getItem('name') ?? '';
    this.route.paramMap.subscribe(paramMap => {
    this.facId = paramMap.get('facilityId') ?? '';
    this.orgId = paramMap.get('orgId') ?? '';
    this.spaceId = paramMap.get('spaceId') ?? '';
    this.userImage = localStorage.getItem('userImage') ?? '';
   if(this.orgId !== this.orgIdCheck){
    localStorage.setItem('orgIdCheck',this.orgId);
    this.viewOrgDetails();
    }
    else{
       this.orgName = localStorage.getItem('orgName') ?? '';
      }
    this.orgIdCheck = localStorage.getItem('orgIdCheck') ?? '';
    this.orgId = localStorage.getItem('orgIdCheck') ?? '';
    if( paramMap.get('facilityId')){
      this.retrieveFacDetails();
    }
    this.setActiveColumn();
    });
    if(this.orgId){
      this.retrievingOrgFacilities();
    }
    if(!this.facId){
      this.noFacilityName = 'Choose a Facility';
    }
      if(!this.spaceId){
        this.noSpaceName = 'Choose a Spaces';
    }
    const email = localStorage.getItem('email') ?? '';
    if(email){
      this.userEmail = email;
    }
  }

  viewOrgDetails() {
    if(this.orgId){
    this.manageOrgService.getViewOrgDetails(this.orgId).subscribe(
      (response : any) => {
        if(response.status === 200){
        this.orgDetails = response?.body;
        this.orgName = this.orgDetails?.name;
        this.userOrgList = true;
        localStorage.setItem('orgIdCheck',this.orgDetails._id);
        localStorage.setItem('orgName', this.orgDetails?.name);
        }
        else{
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
  }
  addOrganization(): void{
    this.router.navigate([adminRoutes.ADMIN_ORG_CREATE]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  addons(): void {
    this.router.navigate([adminRoutes.ADMIN_ADDONS]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  regions(): void {
    this.router.navigate([adminRoutes.ADMIN_REGIONS]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewIncidentClaims(){
    this.router.navigate([adminRoutes.ADMIN_INCIDENTS]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  authLoginMessage() {
    const message = this.authService.getAuthLoginMessage();
    return this.successMessage = message;
  }
removeMessage(){
  setTimeout(() => {
    this.successMessage = '';
    this.authService.removeSuccessMessage();
  }, 3000);
}
  addSpace(): void{
    if(this.orgId && this.facId){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/space/new`]);
    }
  }
  addFacility():void{
    if(this.orgId){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/new`]);
    }
  }
  dashboard(): void{
    if(this.superAdmin){
    this.router.navigate([adminRoutes.ADMIN_DASHBOARD]);
    }
    else{
      this.router.navigate([adminRoutes.USER_DASHBOARD]);
    }
  }
  retrievingOrgFacilities(){
    this.orgId;
    this.createOrgService.retrieveOrgDetails(this.orgId).subscribe(
      (response: any) => {
        if(response.status === 200){
        this.getUserOrgDetails();
        this.facilities = response.body.facilities;
      }
      else{
        this.toastr.error(response.body.message);
      }
      },
      error => {
        if(error.status === 401){
          this.router.navigate([loginRoutes.LOGIN]);
          this.authService.authLogout();
        }
        console.log(error);
      }
    );
  }
  removeOrgName(){
    this.orgName = '';

  }
  retrieveFacDetails() {
    this.facilityService.getOneFacilityDetails(this.facId).subscribe(
      (data: any) => {
        if(data.status === 200){
          this.getUserOrgDetails();
           this.spaceDetails = data.body.spaces;
        }},
      error => {
        if(error.status === 401){
          this.router.navigate([loginRoutes.LOGIN]);
          this.authService.authLogout();
        }
      }
      )
    }
    getOrganizationDetails(event : Event){
      this.orgName = (event.target as HTMLInputElement).value;
      this.searchOrgFacService.getOrganizationDetails(this.orgName).subscribe(
        (response : any) =>{
          if (response.status === 200) {
            this.toastr.clear();
            this.orgDetails = response.body;
            if (response.body.length > 0) {
              console.log('Organization details found:', this.orgDetails);
            } else {
              this.toastr.error('No organization found');
            }
          }
          else{
            this.toastr.error(response.body.message);
             console.log(response.body, 'orgetailserror');
          }
        }
      );
    }
    viewFacility(facilityId: string, name : string){
      if(this.orgId && facilityId){
      this.facilityName = name;
      this.router.navigate([`admin/manage/org/${this.orgId}/facility/${facilityId}`]);
      }
    }
    viewSpace(spaceId: string,name : string){
      if(this.orgId && this.facId && spaceId){
      this.spaceName = name;
      this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/space/${spaceId}`]);
      }
    }
    viewHomePage(){
      this.router.navigate(['/']);
      return this.viewPortScroller.scrollToPosition([0,0]);
    }
    viewOrganization(orgId:string,orgName=''){
        if(orgName){
          this.orgName = orgName;
        }
        this.router.navigate([`admin/manage/org/${orgId}`]);
        return this.viewPortScroller.scrollToPosition([0,0]);
    }
    viewProfile(){
      this.router.navigate([manageRoutes.BASICS_PROFILE]);
      return this.viewPortScroller.scrollToPosition([0,0]);
    }
    setActiveColumn() {
     if(this.orgId && this.facId && this.spaceId){
      this.activeColumn = 3;
     }
     else if(this.orgId && this.facId){
      this.activeColumn = 2;
     }
     else if(this.orgId){
      this.activeColumn = 1;
     }
     else {
      this.activeColumn = 0;
     }
    }
    getUserOrgDetails(){
      if(localStorage.getItem('role') == environment.superAdminRole){
         this.superAdmin = true;
       }
       this.commonService.userOrgDetails$.subscribe((data) => {
        this.userOrgDetails = data;
        if(this.userOrgDetails && this.userOrgDetails.length > 0){
          this.userOrgList = true;
        }
      });
    }
}
