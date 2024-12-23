

import { ViewportScroller } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConst } from 'src/app/app.const';
import { retrievingOrgDetailsService } from 'src/app/services/retrieving-org.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-time-block',
  templateUrl: './time-block.html',
  styleUrls: ['./time-block.css',
    '../space-settings.css',
  ]
})
export class TimeBlockComponent implements OnInit {
  @Input() spaceDetails!: any;
  @Input() timeBlocks!: any;
  @Output() timeBlockTemplateDetails = new EventEmitter<any>();
  @Output() hourlyUpdate = new EventEmitter<boolean>();
  showSpaceTimeBlock = false;
  saveTimeBlock = true;
  hourly !: boolean;
  page = 2; //space time block page
  orgId  = '';
  templateId=0;
  templateName = '';
  pricing = {
    startTime: ''
  };
  times: Array<{ startTime: string, endTime: string }> = [];
  pricingDetails: any[] = [];
  previewOusTimeBlock !:any;
  templateDetails:any = [];
  orgDetails:any;
  constructor(
    private route: ActivatedRoute,
    private appConst : AppConst,
    private router : Router,
    private viewPortScroller : ViewportScroller,
    private retrievingOrgDetailsService: retrievingOrgDetailsService,
    private dialog: MatDialog,
  ) {
   }
   @HostListener('document:click', ['$event'])
   onDocumentClick(event: MouseEvent) {
     const target = event.target as HTMLElement;
     if ((target.closest('.cancel-rental')
      || target.closest('.cancel-buffer')
     || target.closest('.cancel-addons'))) {
       this.showSpaceTimeBlock = false
     }
   }
  ngOnInit(): void {
    this.timeBlocks = this.spaceDetails?.pricing;
    this.previewOusTimeBlock = this.spaceDetails?.pricing;
    this.hourly = this.spaceDetails?.hourly;
    this.route.paramMap.subscribe(paramMap =>{
     this.orgId = paramMap.get('orgId')??'';
     if(this.orgId){
      this.retrievingOrgDetails(this.orgId);
     }
    });
    this.timeBlocks.forEach(() => {
      this.times.push({ startTime: '', endTime: '' });
    });

  }
  changeTimeBlock(){
    this.showSpaceTimeBlock = true;
  }
  viewOrgSetting(){
    this.router.navigate([`/admin/manage/org/${this.orgId}/settings`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
    cancelBlock(){
      this.timeBlocks = this.previewOusTimeBlock;
      this.showSpaceTimeBlock = false;
    }
  OnTimeBlockDetails(event: any) {
    this.pricingDetails = event;
    this.timeBlocks = event;
    this.showSpaceTimeBlock = false;
    this.timeBlockTemplateDetails.emit(this.timeBlocks);
    this.spaceDetails.pricing = this.pricingDetails;
  }
  spaceHourly(event: Event){
    this.spaceDetails.hourly = (event.target as HTMLInputElement).checked;
    this.hourlyUpdate.emit(this.spaceDetails.hourly);
  }
  OnSelectedTemplateId(templateId: number): void {
    if(this.timeBlocks.length > 0){
      const dialogRef =this.dialog.open(ConfirmationPopupComponent,{
        width:'400px',
        data:{
          type:this.appConst.TIMEBLOCKCONFIRMATION, // 5 for template change,
          name: this.orgDetails.templates.find((template: any) => template._id === templateId).name
        }
      });
      dialogRef.afterClosed().subscribe(result=>{
        if(result?.status === this.appConst.TIMEBLOCKCONFIRMATION){
         this.templateId = templateId;
          if(templateId === 1){
            this.timeBlocks = [];
            this.templateName = this.appConst.New_Template_Name
          }
        else if(templateId !== 1){
          this.timeBlocks = this.orgDetails.templates.find((template: any) => template._id === templateId).pricing;
          this.templateName = this.orgDetails.templates.find((template: any) => template._id === templateId).name;
        }
      }
    });
   }
  }
  retrievingOrgDetails(orgId: string){
    this.retrievingOrgDetailsService.getOrgSpaceTemplates(orgId).subscribe(
      (response: any)=>{
        if(response.status === 200){
          this.orgDetails = response.body;
          this.templateDetails = response?.body?.templates;
          }
      });
  }
}


