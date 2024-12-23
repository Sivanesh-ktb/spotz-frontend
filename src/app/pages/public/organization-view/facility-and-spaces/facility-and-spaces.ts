import { Component, Input } from '@angular/core';
import { BlockData } from 'src/app/models/space';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-facility-and-spaces',
  templateUrl: './facility-and-spaces.html',
  styleUrls: ['./facility-and-spaces.css']
})
export class FacilityAndSpacesComponent {
  @Input() organizationFacilities:any;
  @Input() blockData!:BlockData[];
  spaces:any = [];
  constructor(
    private commonService: CommonService
  ){

  }

  convertTime(time:number){
    return this.commonService.normalTimeFormatChange(time);
  }
}
