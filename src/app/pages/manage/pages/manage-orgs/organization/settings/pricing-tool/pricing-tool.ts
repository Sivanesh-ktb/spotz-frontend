import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConst } from 'src/app/app.const';
import { retrievingOrgDetailsService } from 'src/app/services/retrieving-org.service';
import { ConfirmationPopupComponent } from '../../../space/space-settings/confirmation-popup/confirmation-popup';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-pricing-tool',
  templateUrl: './pricing-tool.html',
  styleUrls: ['./pricing-tool.css']
})
export class PricingToolComponent implements OnInit {
  templateName = '';
  templateId=0;
  timeBlocks : any = [];
  templateDetails:any = [];
  templateList=false;
  orgDetails:any;
  showTimeBlock = false;
  orgId = '';
  page = 1; // organization pricing template page
  newTemplateName = this.appConst.New_Template_Name;
  times: Array<{ startTime: string, endTime: string }> = [];
  constructor(
    private appConst: AppConst,
    private retrievingOrgDetailsService: retrievingOrgDetailsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialog : MatDialog,
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
  OnSelectedTemplateId(templateId: number): void {
    this.templateId = templateId;
    this.templateList= true;
    if(templateId === 1){
      this.showTimeBlock = true;
      this.timeBlocks = [];
      this.templateName = this.appConst.New_Template_Name
    }
    else if(templateId !== 1){
      this.timeBlocks = this.orgDetails.templates.find((template: any) => template._id === templateId).pricing;
      this.templateName = this.orgDetails.templates.find((template: any) => template._id === templateId).name;
    }
  }
  cancel(){
     this.templateName = '';
     this.templateId = 1;
     this.showTimeBlock = false;
     this.timeBlocks = [];
      if (this.templateDetails && this.templateDetails.length > 0) {
        this.templateList = true;
      }
  }
  deleteAll(){
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      data: {
        type: this.appConst.PRICINGTOOLCONFIRAMTION
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result?.status === this.appConst.PRICINGTOOLCONFIRAMTION) {
        this.orgDetails.templates.splice(this.templateId, 1);
        this.orgDetails.templates = this.orgDetails.templates.map((template:any) => {
          const { _id, ...rest } = template;
          return rest;
        });
        console.log(this.orgDetails.templates);
        this.updateOrganizationTimeBlockDetails();
      }
    });
  }
  OnOrgTimeBlockDetails(timeBlockDetails: any): void {
    if(this.templateName !== this.appConst.New_Template_Name && this.templateName !== ''){
      if(this.templateId === 1){
        this.templateDetails = [{
          name: this.templateName,
          pricing: timeBlockDetails
      }];
      this.orgDetails.templates.push(this.templateDetails[0]);
    }
      else {
        this.templateDetails = this.orgDetails.templates.map((template: any) => {
          if(template._id === this.templateId){
            return {
              _id: template._id,
              name: this.templateName,
              pricing: timeBlockDetails
              }}
            return template;
          });
        this.orgDetails.templates = this.templateDetails;
       }
       this.updateOrganizationTimeBlockDetails();
    }
  }
  retrievingOrgDetails(orgId: string){
    this.retrievingOrgDetailsService.getOrgSpaceTemplates(orgId).subscribe(
      (response: any)=>{
        if(response.status === 200){
          this.orgDetails = response.body;
          this.templateDetails = response?.body?.templates;
          if(this.templateDetails.length === 0){
            this.templateList = true;
          }}
      });
  }
  updateOrganizationTimeBlockDetails(){
    this.retrievingOrgDetailsService.updateOrgSpaceTemplates(this.orgId, this.orgDetails).subscribe(
      (response: any)=>{
        if(response.status === 200){
          this.templateList = false;
          this.templateName = '';
          this.retrievingOrgDetails(this.orgId);
          this.toastr.success('Template Saved');
        }
      },
    )
  }
}
