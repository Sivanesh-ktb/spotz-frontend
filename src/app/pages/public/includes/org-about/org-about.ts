import { Component, Input, OnInit } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-org-about',
  templateUrl: './org-about.html',
  styleUrls: ['./org-about.css']
})
export class OrgAboutComponent implements OnInit {
  @Input() organizationFacilities: any;
  @Input() organizationDetails: any;
  @Input() page!:number;
  amenities: any[]= [];
  name= '';
  description='';
  constructor(
    private appConst: AppConst
  ){

  }
  ngOnInit() {
    const amenitySet = new Set<string>();
    if(this.organizationFacilities && this.page ==this.appConst.VIEW_ORGANIZATION_PAGE){
      this.name = this.organizationDetails.name;
      this.description = this.organizationDetails.description;
    this.organizationFacilities.forEach((facility: any) => {
       facility.amenity.forEach((amenity: string) => {
        amenitySet.add(amenity);
      });
    });
    this.amenities = Array.from(amenitySet);
  }
  else if(this.organizationFacilities && this.page == this.appConst.VIEW_FACILITY_PAGE){
    this.name = this.organizationFacilities?.name;
    this.description = this.organizationFacilities?.description;
    this.organizationFacilities.amenity.forEach((amenity: string) => {
      amenitySet.add(amenity);
    });
    this.amenities = Array.from(amenitySet);
  }
  else if(this.organizationFacilities && this.page == this.appConst.VIEW_SPACE_PAGE){
    this.name = this.organizationFacilities?.name;
    this.description = this.organizationFacilities?.description;
    this.organizationFacilities?.amenity.forEach((amenity: string) => {
      amenitySet.add(amenity);
    });
    this.amenities = Array.from(amenitySet);
  }
}
  chunkArray(arr: string[], chunkSize: number): string[][] {
    const result = [];
    for (let amenities = 0; amenities < arr.length; amenities += chunkSize) {
      result.push(arr.slice(amenities, amenities + chunkSize));
    }
    return result;
  }

}
