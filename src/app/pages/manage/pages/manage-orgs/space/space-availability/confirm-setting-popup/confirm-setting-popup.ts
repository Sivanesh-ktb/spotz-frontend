import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConst } from 'src/app/app.const';
import { SpaceService } from 'src/app/services/space.service';

@Component({
  selector: 'app-confirm-setting-popup',
  templateUrl: './confirm-setting-popup.html',
  styleUrls: ['./confirm-setting-popup.css'],
})
export class ConfirmSettingPopupComponent implements OnInit {
  @Input() viewMode: 'list' | 'grid' = 'grid';
  orgId = '';
  startTime = '';
  endTime = '';
  startDate = '';
  endDate = '';
  newAvailabilityData: any;
  selectedDays: string[] = [];
  priority = 0;
  constructor(
  private spaceService: SpaceService,
  private appConst:AppConst,
  public dialogRef: MatDialogRef<ConfirmSettingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      orgId:string,
      startTime: string,
      endTime: string,
      startDate: string,
      endDate: string,
      newAvailabilityData: any,
    },
  ){
    this.orgId = data?.orgId;
    this.startTime = data?.startTime;
    this.endTime = data?.endTime;
    this.startDate = data?.startDate;
    this.endDate = data?.endDate;
    this.newAvailabilityData = data?.newAvailabilityData;
  }
  ngOnInit() {
    this.selectedDays = this.newAvailabilityData?.days;
    this.priority = this.newAvailabilityData?.priority?.[0]?.value;
  }
  dismiss(){
    this.dialogRef.close();
  }
  done(){
    this.spaceService.createSpaceAvailability(this.orgId, this.newAvailabilityData).subscribe(
      (response: any) => {
        if (response.status === 200) {
          const page = response?.body?.type;
          this.dialogRef.close({status:this.appConst.NEW_AVAILABILITY_STATUS,page:page});
        }
      }
    );
  }
}
