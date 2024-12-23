import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConst } from 'src/app/app.const';
import { SpaceDTO } from 'src/app/models/space';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-space-view',
  templateUrl: './space-view.html',
  styleUrls: ['./space-view.css']
})
export class SpaceViewComponent implements OnInit {
  spaceId='';
  facName='';
  page = this.appConst.VIEW_SPACE_PAGE;
  spaceData!: SpaceDTO;
  @Output() spaceDetails = new EventEmitter<any>();
  @Output() orgDetails = new EventEmitter<any>();
  @Output() orgFacDetails = new EventEmitter<any>();
  organizationDetails:any;
  organizationFacilities:any;
  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private publicService: PublicService,
    private viewPortScroller: ViewportScroller,
    private appConst: AppConst
  ){

  }
  ngOnInit(){
    this.route.paramMap.subscribe(param=>{
      this.spaceId = param.get('spaceId')??'';
      this.facName = param.get('facName')??'';
      if(this.spaceId){
        this.getViewSpaceDetails(this.spaceId);
      }
    })
  }
  getViewSpaceDetails(spaceId:string){
    this.publicService.getSpaceDetails(spaceId).subscribe(
      (response:any)=>{
        if(response.status == 200){
          this.organizationDetails = response?.body?.org;
          this.organizationFacilities = response?.body?.fac;
          this.spaceDetails.emit(response.body);
          this.spaceData = response.body;
          this.orgDetails.emit(this.organizationDetails);
          this.orgFacDetails.emit(response?.body?.fac)
        }
        else{
          console.log('error in getting space details');
        }
      },
      (error)=>{
        if(error.status == 404){
          const queryParams = {'error':'unavailable'};
          this.router.navigate(['/'], {queryParams});
          return this.viewPortScroller.scrollToPosition([0,0]);
        }
      }
    )
  }

}
