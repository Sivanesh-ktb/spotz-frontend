import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AppConst } from "src/app/app.const";
import { FacilityService } from "src/app/services/facility.service";


@Component({
  selector:'app-fac-spaces',
  templateUrl:'./fac-spaces.html',
  styleUrls:['./fac-spaces.css']

})

export class FacSpacesComponent implements OnInit {
  orgId  = '';
  facilityId  = '';
  orgDetailsForFac : any;
  facilityDetails : any = {};
  facName  = '';
  clearValue!: boolean;
  spaceIds: number[] = [];
  spaceDetails : any = [];
  spaceEnum = this.appConst.SPACES_ENUM;
  constructor(
    private route : ActivatedRoute,
    private facilityService : FacilityService,
    private toastr : ToastrService,
    private router : Router,
    private viewportScroller : ViewportScroller,
    private appConst : AppConst

  ){

  }

  ngOnInit() : void{
    this.route.paramMap.subscribe(paramMap =>{
    this.orgId = paramMap.get('orgId') ?? '';
    if( paramMap.get('facilityId')){
      this.facilityId = paramMap.get('facilityId') ?? '';
      this.getFacilityDetails();
    }
  })
  }
  getFacilityDetails() {
    this.facilityService.getOneFacilityDetails(this.facilityId).subscribe(
      (response: any) => {
        if(response.status == 200){
        this.orgDetailsForFac = response.body.org;
        this.facilityDetails = response.body;
        this.spaceDetails = response.body.spaces;
        console.log(this.facilityDetails.spaces);
        console.log('facilityDetails.spaces');
        this.facName = this.facilityDetails?.name;
      }
      else{
        this.toastr.error(response.body.message);
      }
      }
    )
  }
  viewSpace(spaceId : string){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/${spaceId}`]);
    return this.viewportScroller.scrollToPosition([0,0]);
  }
  viewEditSpace(spaceId : string){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/edit/${spaceId}`]);
    return this.viewportScroller.scrollToPosition([0,0]);
  }
  viewCalendar(spaceId : string){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/${spaceId}/calendar`]);
    return this.viewportScroller.scrollToPosition([0,0]);
  }
  viewBooking(spaceId : string){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/${spaceId}/reservations`]);
    return this.viewportScroller.scrollToPosition([0,0]);
  }
  viewAvailability(spaceId : string){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/${spaceId}/availability`]);
    return this.viewportScroller.scrollToPosition([0,0]);
  }

  onSpaceTypeSelected(event:{spaceId:number[],name:string[]}): void {
    this.spaceIds = event.spaceId;
    if(this.spaceIds.length > 0){
    this.spaceDetails = this.facilityDetails.spaces.filter((space: { typ: number[]; }) =>
      space.typ.some((typId: number) => this.spaceIds.includes(typId))
    );
  }
  else{
    this.spaceDetails = this.facilityDetails.spaces;
  }
  }

  clearFilters() {
    this.spaceIds = [];
    this.spaceDetails = this.facilityDetails.spaces;
    this.clearValue = true;
  }
  viewSpaceName(type: number): string | undefined {
    const foundSpace = this.spaceEnum.find((space) => space.value === type);
    return foundSpace ? foundSpace.name : undefined;
  }
  getSpaceColor(type: number): string {
    return this.appConst.SPACE_COLORS[type] || '#747474';
  }

  addSpace(): void{
    if(this.orgId && this.facilityId){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/new`]);
    }
  }
}

