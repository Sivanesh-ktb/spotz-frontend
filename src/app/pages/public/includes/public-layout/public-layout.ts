import { Component } from '@angular/core';
import { OrganizationViewComponent } from '../../organization-view/organization-view';
import { FacilityViewComponent } from '../../facility-view/facility-view';
import { AppConst } from 'src/app/app.const';
import { SpaceViewComponent } from '../../space-view/space-view';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.css']
})
export class PublicLayoutComponent {

  organizationData:any;
  organizationFacilities:any;
  organizationSliderImages:any;
  page = 0;
  spaceCount = 0;
  lowestPriceSpaceDetails!:{count:number,pricing:number,rentaltypes:number};
  lowestSpaceCount!:number;
  constructor(
   private appConst: AppConst
  ){

  }
  onActivate(component: OrganizationViewComponent | FacilityViewComponent | SpaceViewComponent) {
    if (component instanceof OrganizationViewComponent) {
      this.page =this.appConst.VIEW_ORGANIZATION_PAGE;
      component.orgDetails.subscribe((orgDetails: any) => {
        this.organizationData = orgDetails;
      });
      component.orgFacDetails.subscribe((orgFacData:any)=>{
        this.organizationFacilities = orgFacData;
      });
      component.orgSpaceImages.subscribe((orgSpaceImages:any)=>{
        this.organizationSliderImages = orgSpaceImages;
        this.spaceCount = orgSpaceImages.length;
      });
      component.lowestPriceSpaces.subscribe((lowestPriceSpaces:{count:number,pricing:number,rentaltypes:number})=>{
        this.lowestPriceSpaceDetails = lowestPriceSpaces;
      })
    }
    else if(component instanceof FacilityViewComponent){
      this.page = this.appConst.VIEW_FACILITY_PAGE;
      component.orgDetails.subscribe((orgDetails: any) => {
        this.organizationData = orgDetails;
      });
      component.orgFacDetails.subscribe((orgFacData:any)=>{
        this.organizationFacilities = orgFacData;
      });
      component.orgSpaceImages.subscribe((orgSpaceImages:any)=>{
        this.organizationSliderImages = orgSpaceImages;
      });
    }
    else if(component instanceof SpaceViewComponent){
      this.page = this.appConst.VIEW_SPACE_PAGE;
      component.spaceDetails.subscribe((orgDetails: any) => {
        this.organizationData = orgDetails;
      });

    }
  }
}
