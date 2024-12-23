import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConst } from 'src/app/app.const';
import {retrievingOrgDetailsService} from "src/app/services/retrieving-org.service";

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
export class ReservationsComponent implements OnInit {
  orgId = '';
  orgDetails:any;
  leadTime: any;
  files: any;

  constructor(
    private appConst: AppConst,
    private retrievingOrgDetailsService: retrievingOrgDetailsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ){

  }
  ngOnInit(){
    this.route.paramMap.subscribe(paramMap =>{
      this.orgId = paramMap.get('orgId')??'';
     });
     if(this.orgId){
      this.retrievingOrgDetails(this.orgId);
     }
  }
  retrievingOrgDetails(orgId: string):void{
    this.retrievingOrgDetailsService.getOrgSpaceTemplates(orgId).subscribe(
      (response: any)=>{
        if(response.status === 200){
          this.orgDetails = response.body;
          console.log(this.orgDetails, 'orgDetails');
          this.leadTime = response?.body?.leadTime ?? '0';
          this.files = response?.body?.files?? [];
        }
      });
  }
  onLeadTimeChanged(newLeadTime: string):void {
    this.leadTime = newLeadTime;
    this.updateOrganizationLeadTime();
  }

  updateOrganizationLeadTime(): void {
    const dataToSave = {
      ...this.orgDetails,
      leadTime: this.leadTime
    };

    this.retrievingOrgDetailsService.updateOrgSpaceTemplates(this.orgId, dataToSave).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.toastr.success('Lead time saved successfully');
        } else {
          this.toastr.error('Failed to save lead time');
        }
      },
      (error) => {
        this.toastr.error('Error saving lead time');
        console.error('Error saving lead time:', error);
      }
    );
  }
  onGetUploadedFiles(){
    this.retrievingOrgDetails(this.orgId);
  }
}
