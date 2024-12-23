import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpaceService } from 'src/app/services/space.service';
import { AddRulePopupComponent } from './add-rule-popup/add-rule-popup';
import { BookingService } from 'src/app/services/booking.service';
import { ManageOrgService } from 'src/app/services/manage-org.service';
import { AuthService } from 'src/app/services/auth.service';
import { loginRoutes } from 'src/app/models/enums';

@Component({
  selector: 'app-space-availability',
  templateUrl: './space-availability.html',
  styleUrls: ['./space-availability.css']
})
export class SpaceAvailabilityComponent implements OnInit {
  spaceDetails: any = {};
  orgId = '';
  facId = '';
  spaceId = '';
  facName = '';
  isListView = true;
  viewMode: 'list' | 'grid' = 'list';
  page = 0;
  startDate = '';
  endDate = '';
  groupDetails: any;
  availabilityRoleType = 'all';
  availabilityData: any;
  constructor(
    private route: ActivatedRoute,
    private spaceService: SpaceService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public bookingService: BookingService,
    private manageOrgService: ManageOrgService,
    private authService: AuthService,
    private router: Router
  ){

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.facId = paramMap.get('facilityId') ?? '';
      this.spaceId = paramMap.get('spaceId') ?? '';
      if (this.spaceId) {
        this.getSettingsSpaceDetails();
        this.getAvailability();
      }
      if(this.orgId){
        this.viewOrgDetails()
      }
    });
  }
  getSettingsSpaceDetails() {
    this.spaceService.getSpaceDetails(this.spaceId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.spaceDetails = response.body;
          const facUrl = this.spaceDetails?.fac?.gdUrl;
          this.facName =  facUrl.substring(facUrl.lastIndexOf('/') + 1);
        } else {
          this.toastr.error(response.body.message);
        }
      }
    );
  }
  onSelectedDateRange(event: { startDate: string, endDate: string }) {
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    if(this.orgId && this.startDate && this.endDate){
    this.getAvailability();
    }
}
roleType(role:string) {
  this.availabilityRoleType = role;
}
addAvailability(type:number) {
  const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.position = {
      top: '10',
    };
    dialogConfig.data = {
      type: type,
      orgId: this.orgId,
      groupDetails: this.groupDetails,
      spaceDetails: this.spaceDetails
    };
    const dialogRef = this.dialog.open(AddRulePopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result?.status === 1){
     this.getAvailability();
      }
    });
}
getAvailability(){
  if(this.orgId && this.startDate && this.endDate){
    this.bookingService.retrievingAvailabilityData(this.spaceId,this.startDate,this.endDate).subscribe(
      (response:any)=>{
        if(response.status === 200){
          console.log(response.body);
          this.availabilityData = response.body;
        }
        else{
          this.toastr.error(response.body.message);
        }
      }
    );
  }
}
viewOrgDetails() {
  this.manageOrgService.getViewOrgDetails(this.orgId).subscribe(
    (response: any) => {
      if(response.status === 200){
       this.groupDetails = response?.body?.groups;
      }
    },
    (error) => {
      if(error.status === 401){
        this.authService.authLogout();
        this.router.navigate([loginRoutes.LOGIN]);
      }
      else{
        this.toastr.error(error.message);
      }
    });

}
onRefreshNewData(){
  this.getAvailability();
}
  toggleView(isList: boolean): void {
    this.isListView = isList;
    this.viewMode = isList ? 'list' : 'grid'; 
  }
}
