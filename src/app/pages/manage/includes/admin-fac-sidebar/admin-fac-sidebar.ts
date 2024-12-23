
import { ViewportScroller } from "@angular/common";
import { Component, Input, OnInit  } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DeleteManageOrganizationComponent } from "../../pages/manage-orgs/delete-manage-organization/delete-manage-organization.component";
import { FacilityService } from "src/app/services/facility.service";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: 'app-admin-fac-sidebar',
  templateUrl:'./admin-fac-sidebar.html',
  styleUrls:['./admin-fac-sidebar.css']
})

export class AdminFacSidebarComponent implements OnInit {
  orgId  = '';
  facId  = '';
  @Input() facilityName  = '';
  @Input() facName  = '';
  @Input() orgName  = '';
  currentRoute= '';
  facDetails:any;
  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private viewportScroller : ViewportScroller,
    private dialog : MatDialog,
    private facilityService: FacilityService,
    private toastr: ToastrService,
    private commonService: CommonService
  ){
    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd){
        this.currentRoute = this.getRouteFromUrl(event.urlAfterRedirects);
      }
    })

  }

  ngOnInit() : void{
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.facId = paramMap.get('facilityId') ?? '';
      this.currentRoute = this.getRouteFromUrl(this.router.url);
    });
    this.getFacilityDetails();
  }
  viewFacility (){
    if(this.orgId && this.facId){
      this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}`]);
      return this.viewportScroller.scrollToPosition([0, 0]);
    }
    else {
      console.log('no orgId or facilityId');
    }
}
viewSpaces(){
  if(this.orgId && this.facId){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/spaces`]);
    return this.viewportScroller.scrollToPosition([0,0]);
  }
}
viewFacEvents(){
  if(this.orgId && this.facId){
  this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/reservations`]);
  return this.viewportScroller.scrollToPosition([0,0]);
  }
}

deleteOrgManage(){
  this.dialog.open(DeleteManageOrganizationComponent,{
    width:'400px',
    data:{
      orgId: this.orgId,
      facId : this.facId,
      displayName:this.facilityName,
      facName:this.orgName
      }
  });
}
viewFacMap(){
  if(this.orgId && this.facId){
  this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/map`]);
  return this.viewportScroller.scrollToPosition([0,0]);
  }

}
viewFacCalendar(){
  if(this.orgId && this.facId){
  this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/calendar`]);
  return this.viewportScroller.scrollToPosition([0,0]);
  }
}
getRouteFromUrl(url: string) {
  if (url.includes('spaces')) {
    return 'spaces';
  }
  else if (url.includes('map')) {
    return 'map';
  }
  else if(url.includes('calendar')){
    return 'calendar';
  }
  else if (url.includes('reservations')) {
    return 'reservations';
  }
  else if(url.includes('/facility/'))
   {
    return 'viewFac';
   }
return '';
}
getFacilityDetails() {
  this.facilityService.getOneFacilityDetails(this.facId).subscribe(
    (response: any) => {
      if(response.status == 200){
       this.facDetails = response.body;
    }
    else{
      this.toastr.error(response.body.message);
    }
    }
  )
}
viewFacPage(){
  if(this.orgId && this.facId){
    const url = `/${this.commonService.removeEmptySpaces(this.facDetails.address.state)}/${this.commonService.removeEmptySpaces(this.facDetails.address.city)}/orgs/${this.orgName}/facilities/${this.facId}`;
    const newTab = window.open(url, '_blank');
    if (newTab) {
        newTab.onload = function() {
        newTab.scrollTo(0, 0);
      };
    }
}
  }
}


