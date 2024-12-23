import { ViewportScroller } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppConst } from 'src/app/app.const';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-org-view-header',
  templateUrl: './org-view-header.html',
  styleUrls: ['./org-view-header.css']
})
export class OrgViewHeaderComponent implements OnInit {
  @Input() organizationData: any;
  @Input() organizationFacilities:any;
  @Input() page!: number;
  @Input() lowestPriceSpaceDetails!:{count:number,pricing:number,rentaltypes:number};
  @Input() spaceCount!:number;
  orgName ='';
  orgAddress = '';
  orgLogo = '';
  pricing = 0;
  rentaltypes=0;
  capacity=0;
  spacePage = this.appConst.VIEW_SPACE_PAGE;
  parentName = '';
  url = '';
  constructor(
    private appConst: AppConst,
    private router: Router,
    private viewPortScroller: ViewportScroller,
    private commonService: CommonService,
    private titleService: Title,
  ){

  }
  ngOnInit(){

    if(this.page == this.appConst.VIEW_ORGANIZATION_PAGE){
    this.orgName = this.organizationData?.name;
    this.orgLogo = this.organizationData?.logo;
    this.orgAddress =  this.organizationData?.address?.city + ', ' + this.organizationData?.address?.state;
    this.titleService.setTitle(this.organizationData?.name+':'+this.organizationData?.address?.city + ', ' + this.organizationData?.address?.state  );
    }
    else if (this.page == this.appConst.VIEW_FACILITY_PAGE){
      this.orgName = this.organizationFacilities?.name;
      this.parentName = this.organizationData?.name;
      this.url = `/${this.commonService.removeEmptySpaces(this.organizationData?.address?.state)}/${this.commonService.removeEmptySpaces(this.organizationData?.address?.city)}/orgs/${this.organizationData?.shortName}`;
      this.orgLogo = this.organizationFacilities?.banner;
      this.orgAddress =
      this.organizationFacilities?.address?.city +
      ', ' +
      this.organizationFacilities?.address?.state
      this.titleService.setTitle(this.organizationFacilities?.name+':'+this.organizationData?.name+':'+this.organizationData?.address?.city + ', ' + this.organizationData?.address?.state  );
    }
    else if(this.page == this.appConst.VIEW_SPACE_PAGE){
      this.orgName = this.organizationData?.org.name;
       this.orgLogo = this.organizationData?.assets[0]?.url;
          this.orgAddress =
            this.organizationData?.fac?.address?.city +
            ', ' +
            this.organizationData?.fac?.address?.state;
      this.pricing = this.organizationData?.price;
      this.rentaltypes = this.organizationData?.rentalType;
      this.capacity = this.organizationData?.capacity;
      this.parentName = this.organizationData?.name;
      this.titleService.setTitle(this.organizationData?.name+':'+this.organizationData?.fac?.address?.city + ', ' + this.organizationData?.fac?.address?.state  );
      this.url = `/${this.commonService.removeEmptySpaces(this.organizationData?.fac?.address?.state)}/${this.commonService.removeEmptySpaces(this.organizationData?.fac?.address?.city)}/orgs/${this.orgName}/facilities/${this.organizationData?.fac?._id}`;
  }
  else{
    const queryParams = {'error':'unavailable'};
    this.router.navigate(['/'], {queryParams});
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
}
}
