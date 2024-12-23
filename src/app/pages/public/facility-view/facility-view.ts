import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConst } from 'src/app/app.const';
import { BlockData, SpaceData } from 'src/app/models/space';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-facility-view',
  templateUrl: './facility-view.html',
  styleUrls: ['./facility-view.css']
})
export class FacilityViewComponent implements OnInit {
  blockData!:BlockData[];
  organizationFacilitiesSpaces!:SpaceData[];
  currentFacUrl='';
  city='';
  state='';
  orgName='';
  facName='';
  facId='';
  organizationDetails: any;
  organizationFacilities:any;
  page = this.appConst.VIEW_FACILITY_PAGE; // 2 for facility view page
  @Output() orgDetails = new EventEmitter<any>();
  @Output() orgFacDetails = new EventEmitter<any>();
  @Output() orgSpaceImages = new EventEmitter<any>();
  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
    private router: Router,
    private viewPortScroller: ViewportScroller,
    private appConst: AppConst
  ){

  }
  ngOnInit(){
    this.route.paramMap.subscribe(param =>{
      this.orgName = param.get('orgName')??'';
      this.facName = param.get('facName')??'';
      this.city = param.get('city')??'';
      this.state = param.get('state')??'';
      if(this.orgName && this.facName && this.city && this.state){
        this.getFacilityDetails();
      }
    })
  }

  getFacilityDetails(){
    this.publicService.retrieveFacilityDetails(this.orgName, this.facName, this.city, this.state).subscribe(
      (response:any)=>{
        if(response.status == 200){
          this.organizationDetails = response?.body?.org;
          this.organizationFacilities = response?.body;
          this.facId = this.organizationFacilities?._id;
          if(this.facId){
            this.getSpaceDetails();
          }

        }
        else{
           this.router.navigate(['/'], {queryParams:{'error':'unavailable'}});
        }
      },
      (error)=>{
         if(error.status == 404){
           const queryParams = {'error':'unavailable'};
           this.router.navigate(['/'], {queryParams});
           return this.viewPortScroller.scrollToPosition([0,0]);
         }
      });
  }
  getSpaceDetails(){
    this.publicService.retrieveSpaceDetails(this.facId).subscribe(
      (response:any)=>{
        if(response.status == 200){
          this.orgSpaceImages.emit(response.body);
          this.orgDetails.emit(this.organizationDetails);
          this.orgFacDetails.emit(this.organizationFacilities);
          this.getOrgFacDetails(response.body[0].org);
        }
      }
    )
  }
  getOrgFacDetails(orgId:string){
    this.publicService.getFacilitySpaceDetails(orgId,this.facId).subscribe(
      (response:any)=>{
        if(response.status == 200){
          this.blockData=response.body.blocksData;
          this.organizationFacilitiesSpaces = response.body?.spaces;

        }
        else{
          console.log('error in getting facility details');
        }
      }
    )
  }
  onSelectedSpaceTypes(event:any){
    this.organizationFacilitiesSpaces = event;
  }
}
