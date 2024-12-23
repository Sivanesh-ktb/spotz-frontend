import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockData } from 'src/app/models/space';
import { PublicService } from 'src/app/services/public.service';
import { StatusCode } from 'src/app/status-code';

@Component({
  selector: 'app-organization-view',
  templateUrl: './organization-view.html',
  styleUrls: ['./organization-view.css']
})
export class OrganizationViewComponent implements OnInit {
  orgName = '';
  organizationDetails: any;
  organizationFacilities:any;
  organizationFacilitiesSpaces:any;
  blockData!:BlockData[];
  page = 1; // 1 for organization view page
  @Output() orgDetails = new EventEmitter<any>();
  @Output() orgFacDetails = new EventEmitter<any>();
  @Output() orgSpaceImages = new EventEmitter<any>();
  @Output() lowestPriceSpaces = new EventEmitter<{count:string,pricing:number,rentaltypes:number}>();
  orgSpaces = [];
  constructor(
    private publicService: PublicService,
    private route: ActivatedRoute,
    private router: Router,
    private viewPortScroller: ViewportScroller
  ) {
  }
  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.orgName = param.get('orgName') ?? '';
      if (this.orgName) {
        this.retrieveOrganizationDetails(this.orgName);
      }
    });
  }
  retrieveOrganizationDetails(orgName: string) {
    this.publicService.getOrganizationDetails(orgName).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.organizationDetails = response.body;
          this.getFacSpaceDetails(this.organizationDetails._id);
          this.getOrgFacDetails(this.organizationDetails._id);
        }
      },
      (error)=>{
        if(error.status == 404){
          const queryParams = {'error':'unavailable'};
          this.router.navigate(['/'], {queryParams});
          return this.viewPortScroller.scrollToPosition([0,0]);
        }
      }
    );
  }
  getOrgFacDetails(orgId:string){
    this.publicService.getOrganizationFacilities(orgId).subscribe(
      (response:any)=>{
        if(response.status == 200){
          this.orgDetails.emit(this.organizationDetails);
          this.orgFacDetails.emit(response.body);
          this.organizationFacilities = response.body;
        }
        else{
          console.log('error in getting facility details');
        }
      }
    )
  }
  getFacSpaceDetails(orgId:string){
    this.publicService.getFacilitySpaceDetails(orgId).subscribe(
      (response:any)=>{
        if(response.status == StatusCode.SUCCESS){
          this.blockData = response.body.blocksData;
          this.organizationFacilitiesSpaces = response.body?.spaces;
          this.orgSpaces = this.organizationFacilitiesSpaces;
          this.lowestPriceSpaces.emit({
            count:response.body?.lowestPriceSpaces?.length??0,
            pricing:response.body?.lowestPriceSpaces[0]?.price??0,
            rentaltypes:response.body?.lowestPriceSpaces[0]?.rentaltypes??0});
          this.orgSpaceImages.emit(response.body?.spaces);
        }
      }
    )
  }
  onSelectedSpaceTypes(event:any){
    this.organizationFacilitiesSpaces = event;
  }
}
