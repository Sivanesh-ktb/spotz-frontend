import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpaceService } from 'src/app/services/space.service';

@Component({
  selector: 'app-space-calendar',
  templateUrl: './space-calendar.html',
  styleUrls: ['./space-calendar.css']
})
export class SpaceCalendarComponent implements OnInit {
  spaceId='';
  spaceDetails : any = {};
  spaceArray : any = [];
  facName = '';
  constructor(
    private spaceService: SpaceService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ){

  }
  ngOnInit(){

    this.route.paramMap.subscribe(params =>{
      this.spaceId = params.get('spaceId') ?? '';
      if(this.spaceId){
        this.getSettingsSpaceDetails();
      }
    })
  }

  getSettingsSpaceDetails() {
    this.spaceService.getSpaceDetails(this.spaceId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.spaceDetails = response.body;
          this.spaceArray = [this.spaceDetails];
          const facUrl = this.spaceDetails?.fac?.gdUrl;
          this.facName =  facUrl.substring(facUrl.lastIndexOf('/') + 1);
        } else {
          this.toastr.error(response.body.message);
        }
      }
    );
  }
}
