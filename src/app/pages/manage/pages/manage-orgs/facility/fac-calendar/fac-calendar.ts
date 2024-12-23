import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConst } from 'src/app/app.const';
import { FacilityService } from 'src/app/services/facility.service';

@Component({
  selector: 'app-fac-calendar',
  templateUrl: './fac-calendar.html',
  styleUrls: ['./fac-calendar.css']
})
export class FacCalendarComponent implements OnInit {
  facId='';
  orgDetailsForFac: any;
  facilityDetails: any;
  facName = '';
  spaceDetails: any[] = [];

constructor(
  private facilityService: FacilityService,
  private toastr: ToastrService,
  private route: ActivatedRoute,
  private appConst : AppConst

){

}
ngOnInit() : void{
  this.route.paramMap.subscribe(paramMap =>{
    this.facId = paramMap.get('facilityId')??'';
  })
this.getFacilityDetails();
}
getFacilityDetails() {
  this.facilityService.getOneFacilityDetails(this.facId).subscribe(
    (response: any) => {
      if (response.status === 200) {
        this.orgDetailsForFac = response.body.org;
        this.facilityDetails = response.body;
        this.facName = this.facilityDetails?.name;
        this.spaceDetails = this.facilityDetails.spaces;
      } else {
        this.toastr.error(response.body.message);
      }
    }
  );
}
spaceType(type: [any]) {
  if(type && type.length > 1){
     return 'Multiple';
  }
  else{
  const spaceTypes = this.appConst.SPACES_ENUM;
  const space = spaceTypes.find(space => space.value === type[0]);
  return space ? space.name : 'Unknown';
  }
}
}
