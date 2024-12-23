import { ViewportScroller } from "@angular/common";
import { HttpResponse } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { DuplicateSpaceComponent } from "../../pages/manage-orgs/space/duplicate-space/duplicate-space";
import { DeleteManageOrganizationComponent } from "../../pages/manage-orgs/delete-manage-organization/delete-manage-organization.component";
import { AppConst } from "src/app/app.const";
import { FacilityService } from "src/app/services/facility.service";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "src/app/services/common.service";
import { SpaceDTO } from "src/app/models/search";
import { StatusCode } from "src/app/status-code";
import { FacilityResponseDTO } from "src/app/models/facility";

@Component({
  selector: 'app-admin-space-sidebar',
  templateUrl:'./admin-space-sidebar.html',
  styleUrls:['./admin-space-sidebar.css']
})
export class AdminSpaceSidebarComponent implements OnInit {
  @Input() displayName!: string;
  @Input() rentaltypes!: number;
  @Input() price!: string;
  @Input() facName!: string;
  @Input() selectedSpaceTypeEvent!: {name:string,value:number};
  orgId  = '';
  facId  = '';
  spaceId  = '';
  types = '';
  spaceDetails : any;
  role  = '';
  currentRoute= '';
  matchedEnum : { name: string; value: number; home: boolean; sort: number }[] =
  [];
  multipleSelect = this.appConst.multiSelect;
  singleSpaceType = false;
  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private viewPortScroller : ViewportScroller,
    private dialog : MatDialog,
    private appConst: AppConst,
    private facilityService: FacilityService,
    private toastr: ToastrService,
    private commonService: CommonService
  ){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.getCurrentSpaceRouteUrl(event.urlAfterRedirects);
         }
    });
  }

  ngOnInit() : void{
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.facId = paramMap.get('facilityId')??'';
      this.spaceId = paramMap.get('spaceId')??'';
      this.role = localStorage.getItem('role')??'';
      this.currentRoute = this.getCurrentSpaceRouteUrl(this.router.url);
    })
    this.getSpaceDetails();
    if(this.rentaltypes === 0){
      this.types =  this.appConst.rentalTypeOne;
    }
    else if(this.rentaltypes === 1){
      this.types = this.appConst.rentalTypeTwo;
    }
  }
  viewSpace (){
    if(this.orgId && this.facId && this.spaceId){
      this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/space/${this.spaceId}`]);
      return this.viewPortScroller.scrollToPosition([0,0]);
    }
    else{
      console.log('no space available');
    }
  }
  viewSpaceSettings(){
    if(this.orgId && this.facId && this.spaceId){
      this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/space/${this.spaceId}/settings`]);
      return this.viewPortScroller.scrollToPosition([0,0]);
    }
    else{
      console.log('no space available');
    }
  }
  viewSpacePhotos(){
    if(this.orgId && this.facId && this.spaceId){
      this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/space/${this.spaceId}/photos`]);
      return this.viewPortScroller.scrollToPosition([0,0]);
    }
    else{
      console.log('no space available');
    }
  }
  duplicateSpace(){
    this.dialog.open(DuplicateSpaceComponent,{
      width:'400px',
      data:{
        orgId: this.orgId,
        facId : this.facId,
        spaceId:this.spaceId,
        displayName:this.displayName,
        facName:this.facName}
    });
  }
  viewReservation(){
    if(this.orgId && this.facId && this.spaceId){
      this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/space/${this.spaceId}/reservations`]);
      return this.viewPortScroller.scrollToPosition([0,0]);
    }
    else{
      console.log('no space available');
    }
  }
  deleteOrgManage(){
    this.dialog.open(DeleteManageOrganizationComponent,{
      width:'400px',
      data:{
        orgId: this.orgId,
        facId : this.facId,
        spaceId:this.spaceId,
        displayName:this.displayName,
        facName:this.facName}
    });
  }
  getCurrentSpaceRouteUrl(url: string) {
    if (url.includes('settings')) {
      return 'settings';
    }
    else if (url.includes('photos')) {
      return 'photos';
    }
    else if (url.includes('reservations')) {
      return 'reservations';
    }
    else if (url.includes('calendar')) {
      return 'calendar';
    }
    else if (url.includes('availability')) {
      return 'availability';
    }
    else if(url.includes('space')){
      return 'space';
    }
    else{
      return '';
    }
  }

  viewCalendar(){
    if(this.orgId && this.facId && this.spaceId){
      this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/space/${this.spaceId}/calendar`]);
      return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  viewSpaceAvailability(){
    if(this.orgId && this.facId && this.spaceId){
      this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/space/${this.spaceId}/availability`]);
      return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  getSpaceDetails() {
    this.facilityService.getOneFacilityDetails(this.facId).subscribe(
      (response: HttpResponse<FacilityResponseDTO>) => {
        if(response.status == StatusCode.SUCCESS){
         this.spaceDetails = response.body;
         const matchedSpace = this.spaceDetails?.spaces.find((space: SpaceDTO) => space.id === this.spaceId);
         if (matchedSpace && matchedSpace.typ && matchedSpace.typ.length === this.appConst.SPACES_TYPE) {
         const matchedEnum = this.appConst.SPACES_ENUM.find(space => space.value === matchedSpace.typ[0]);
        if(matchedEnum){
          this.matchedEnum = [matchedEnum];
          if(this.matchedEnum && this.spaceId){
             this.singleSpaceType = true;
            this.selectedSpaceTypeEvent = {name:this.matchedEnum[0].name,value:this.matchedEnum[0].value};
          }
        }
      }
      else{
        this.selectedSpaceTypeEvent= { name : this.appConst.multiSelect,value:0};
      }
    }

      }
    )
  }
  viewSpacePage(){
    if(this.orgId && this.facId){
     const orgName= localStorage.getItem('orgName');
      const url = `/${this.commonService.removeEmptySpaces(this.spaceDetails.address.state)}/${this.commonService.removeEmptySpaces(this.spaceDetails.address.city)}/orgs/${orgName}/facilities/${this.spaceDetails.short}/${this.spaceId}`;
      const newTab = window.open(url, '_blank');
      if (newTab) {
          newTab.onload = function() {
          newTab.scrollTo(0, 0);
        };
      }
    }
  }
  getSpaceColor(type: number): string {
    return this.appConst.SPACE_COLORS[type] || this.appConst.defaultColor;
  }
}
