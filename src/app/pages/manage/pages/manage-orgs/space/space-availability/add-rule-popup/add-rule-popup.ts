import { ViewportScroller } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppConst } from 'src/app/app.const';
import { SpaceService } from 'src/app/services/space.service';
import { ConfirmSettingPopupComponent } from '../confirm-setting-popup/confirm-setting-popup';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { SpaceData } from 'src/app/models/space';

@Component({
  selector: 'app-add-rule-popup',
  templateUrl: './add-rule-popup.html',
  styleUrls: ['./add-rule-popup.css']
})
export class AddRulePopupComponent implements OnInit {
type = 0;
startDate !: Date;
endDate !: Date;
startTime = '';
endTime = '';
multiple = true;
times: string[] = [];
orgId = '';
facId = '';
spaceId = '';
popupHeader = '';
description = '';
reason = '';
attendance='';
sport='';
minDate: Date;
checkAll = false;
dateLabel = 'Start Date';
validate = true;
groupDetails: any;
spaceDetails: any;
editData: any;
priority : { display: string, value: number }[] = [];
days : string[] = [];
newAvailabilityData: any;
isDisabled = false;
roleDescription='';
userId = '';
assignValidate=false;
selectedPriority = 0;
link='';
capacity='';
internal !: number;
assign = false;
group:any;
uid:any;
msg='';
assignDescription='';
selectedGroupUser:any;
groupMembers : any;
groupUsers : any;
members : any;
selectedGroupId = '';
selectedGroup:any;
 constructor(
  public dialogRef: MatDialogRef<AddRulePopupComponent>,
  @Inject(MAT_DIALOG_DATA) public data: {
    type: number,
    orgId:string,
    groupDetails: any,
    spaceDetails: any,
    editData: any
    userId: string
  },
  public appConst: AppConst,
  private router: Router,
  private viewPortScroller: ViewportScroller,
  private spaceService: SpaceService,
  private dialog: MatDialog,
  private toastr: ToastrService,
  private commonService: CommonService,
 ){
this.type = data?.type;
this.orgId = data?.orgId;
this.groupDetails = data?.groupDetails;
this.spaceDetails = data?.spaceDetails;
this.editData = data?.editData;
this.userId = data?.userId;
this.minDate = new Date();
 }
ngOnInit(){
  this.generateTimes(this.spaceDetails);
  if(this.userId && this.editData){
  this.updateValues();
  this.validate = false;
  }
  if(this.type == 1){
  this.popupHeader = this.appConst.AVAILABILITY_TITLE;
  this.checkValues();

  }
  else if(this.type == -1){
    this.multiple = false;
    this.dateLabel = 'Date';
    this.popupHeader = this.appConst.EXCEPTION_TITLE;
  }
  else if(this.type == -2){
    this.multiple = false;
    this.dateLabel = 'Date';
    this.popupHeader = this.appConst.ASSIGN_SPACE_TITLE;
  }
}
generateTimes(spaceData?: SpaceData): void {
  const rentalBlock = spaceData?.rental?.block;
  this.times = []; 
  const period = this.appConst.PERIOD;
  let interval = this.appConst.RENTAL_BLOCK_SIXTY_MINUTES; 
  if (rentalBlock === this.appConst.RENTAL_BLOCK_SIXTY) {
    interval = this.appConst.RENTAL_BLOCK_SIXTY_MINUTES;
  } else if (rentalBlock === this.appConst.RENTAL_BLOCK_THIRTY) {
    interval = this.appConst.RENTAL_BLOCK_THIRTY_MINUTES;
  } else if (rentalBlock === this.appConst.RENTAL_BLOCK_FIFTEEN) {
    interval = this.appConst.RENTAL_BLOCK_FIFTEEN_MINUTES;
  }
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes += interval) {
      const hour = hours % 12 === 0 ? 12 : hours % 12;
      const formattedHour = hour < 10 ? '0' + hour : hour;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      const time = `${formattedHour}:${formattedMinutes} ${period[Math.floor(hours / 12)]}`;
      this.times.push(time);
    }
  }
}

checked(){
  this.multiple = !this.multiple;
  this.checkValues();
  if(!this.multiple){
    this.dateLabel = 'Date';
    this.endDate != undefined;
  }
  else{
    this.dateLabel = 'Start Date';
  }
}
  dismiss() {
   this.dialogRef.close();
    this.editData.startTime = this.convertTo24HourFormat(this.editData.startTime);
    this.editData.endTime = this.convertTo24HourFormat(this.editData.endTime);
  }
  viewGroup(){
    if(this.orgId ){
      this.dialogRef.close();
      this.router.navigate([`/admin/manage/org/${this.orgId}/groups`]);
      return this.viewPortScroller.scrollToPosition([0,0]);
  }
  }
  validateTime() {
    if (this.startTime && this.endTime) {
      const startTimeValue = this.convertTimeToMinutes(this.startTime);
      const endTimeValue = this.convertTimeToMinutes(this.endTime);
      if (startTimeValue >= endTimeValue) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  private convertTimeToMinutes(time: string): number {
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    let totalMinutes = (hours % 12) * 60 + minutes;
    if (period.toLowerCase() === 'pm') {
      totalMinutes += 12 * 60;
    }
    return totalMinutes;
  }
  onPrioritySelected(selectedPriority: { display: string, value: number }) {
    this.priority = [selectedPriority];
    if(this.editData){
      this.editData.access = selectedPriority.value;
    }
    this.checkValues();
  }
  checkPriorityValues(){
    if(this.priority.length > 0){
      return false;
    }
    else{
      return true
    }
  }
  checkDays(){
    if(this.days.length > 0 || !this.multiple){
      return false;
    }
    else{
      return true;
    }
  }
  onDaySelected(selectedDays: string[]) {
    this.days = selectedDays;
    this.checkValues();
  }

  validateDate() {
    if (this.startDate && this.endDate && this.multiple) {
      if (this.startDate > this.endDate) {
        return true;
      } else {
        return false;
      }
    }
      else if(this.startDate && !this.endDate && !this.multiple){
          return false;
      }
      else if(this.startDate){
        return false;
      }
    else {
      return true;
    }
}
checkValues(){
  const checkTime = this.validateTime();
  const checkPriority = this.checkPriorityValues();
  const checkDays = this.checkDays();
  const checkDate = this.validateDate();
  if(this.type === 1){
    if(checkTime || checkPriority || checkDays || checkDate ){
         this.validate = true;
      }
      else{
          this.validate = false;
      }
  }
  else if(this.type === -1){
    if(checkTime || checkPriority || checkDays || checkDate || !this.description || !this.reason){
      this.validate = true;
    }
    else{
      this.validate = false;
    }
  }
  else if(this.type === -2){
   if(checkTime || checkPriority || checkDays || checkDate || !this.sport || !this.attendance || this.assignValidate){
      this.validate = true;
    }
    else{
      this.validate = false;
    }
  }
}
validateTimeTemplate(){
  if(this.spaceDetails.pricing.length === 0){
    return true;
  }
  else if(this.spaceDetails.pricing.length > 0){
    const check = this.spaceDetails.pricing.every((pricing: { checked: boolean; }) => {
      return !pricing.checked;
    });
    return check;
  }
}
saveAvailability(){
  if(this.validate){
    return;
  }
  if(this.type === 1){
    this.roleDescription = 'Availability Rule';
  }
  if (this.type === 1) {
       this.roleDescription = 'Availability for space :' + this.spaceDetails.name;
    }
    else if (this.type === -1) {
       this.roleDescription = 'Exception for space :' + this.spaceDetails.name;
    }
    else{
       this.roleDescription = 'Assignment for space: ' + this.spaceDetails.name;
    }
  this.newAvailabilityData = this.formatData();
  this.spaceService.addAvailability(this.orgId,this.newAvailabilityData).subscribe(
    (response:any)=>{
      if(response.status === 200){
        if(this.type === 1 || this.type === -1){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '1600px';
        dialogConfig.position = {
          top: '10',
        };
        this.newAvailabilityData.startTime = this.convertTo24HourFormat(this.newAvailabilityData.startTime);
        this.newAvailabilityData.endTime = this.convertTo24HourFormat(this.newAvailabilityData.endTime);
        dialogConfig.data = {
          orgId: this.orgId,
          startTime: this.startTime,
          endTime: this.endTime,
          startDate: this.startDate,
          endDate: this.endDate,
          newAvailabilityData: this.newAvailabilityData,
        };
        const dialogRef = this.dialog.open(ConfirmSettingPopupComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          this.dialogRef.close({status:this.appConst.NEW_AVAILABILITY_STATUS});
          if (result?.status === this.appConst.NEW_AVAILABILITY_STATUS && result?.page === 1) {
            this.toastr.success('Availability rule added successfully');
          }
          else if(result?.status === this.appConst.NEW_AVAILABILITY_STATUS){
            this.toastr.success('Exception rule added successfully');
          }
        });
      }else{
        this.newAvailabilityData.startTime = this.convertTo24HourFormat(this.newAvailabilityData.startTime);
        this.newAvailabilityData.endTime = this.convertTo24HourFormat(this.newAvailabilityData.endTime);
        this.spaceService.createSpaceAvailability(this.orgId, this.newAvailabilityData).subscribe(
          (response: any) => {
            if (response.status === 200) {
              this.dialogRef.close();
              this.toastr.success('Assignment added successfully');
            }
          }
        );
      }
      }
    }
  );

}
convertTo24HourFormat(time: string): number {
  const [timePart, modifier] = time.split(' ');
  let [hours] = timePart.split(':').map(Number);
  if (modifier === 'PM' && hours !== 12) {
      hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
  }
  return hours;
}
updateValues(){
  if(this.editData){
  this.isDisabled = true;
  this.startDate = new Date(this.editData.startDate);
  this.endDate = this.editData.endDate?new Date(this.editData.endDate): new Date();
  this.startTime = this.editData.startTime;
  this.endTime = this.editData.endTime;
  this.multiple = this.editData.multiple;
  this.priority = [{display: this.editData.lvl, value: this.editData.access}];
  this.days = this.editData.days;
  this.description = this.editData.description;
  this.reason = this.editData.reason;
  this.attendance = this.editData.attendance;
  this.sport = this.editData.sport;
  this.selectedPriority = this.editData.access;
  if(this.editData.endDate){
    this.multiple = true;
  }
  }
}

updateAvailability(){
  this.editData.startTime = this.convertTo24HourFormat(this.editData.startTime);
  this.editData.endTime = this.convertTo24HourFormat(this.editData.endTime);
  this.spaceService.updateAvailabilityRuleData(this.orgId, this.editData._id, this.editData).subscribe(
    (response:any)=>{
      if(response.status === 200){
        this.dialogRef.close({status:1});
        this.toastr.success('Availability rule updated successfully');
      }
    }
  );
}
onSelectedDetails(event: { link: string, capacity: string, description: string, internal: boolean, assign: boolean, group: object, uid: string,members:object,msg:string }) {
  console.log(event);
  this.link = event.link;
  this.capacity = event.capacity;
  this.assignDescription = event.description;
  this.internal = event.internal?1:0;
  this.assign = event.assign;
  this.group = event.group;
  this.uid = event.uid;
  this.members = event.members;
  this.msg = event.msg;
  this.formatData();
}
onFormValidChange(event: boolean) {
  this.assignValidate = event;
  this.checkValues();
}
formatData(){
  return {
    access: this.priority[0].value,
    divisor: 1,
    type: this.type,
    startDate: this.startDate,
    endDate: this.endDate,
    endTime: this.endTime,
    info: {
      o: {
        id: this.orgId,
        name: this.groupDetails.name,
      },
    },
    lvl: this.priority[0].display,
    multiple: this.multiple,
    options: [],
    pricing: this.spaceDetails?.pricing.map((pricing: any) => ({
      ...pricing,
      checked: !!pricing.checked,
    })),
    reason: this.reason,
    ruleset:{
      description:this.roleDescription,
                rules: [{
                    name: 'System generated rule',
                    facilityOptions:    {
                        type: 2,
                        tags: [],
                        facilities: [{
                            id: this.spaceDetails.fac.fid,
                            name: this.spaceDetails.name
                        }]
                    },
                    spaceOptions:{
                        type: 2,
                        spaceTypes: [],
                        spaces: [{
                            id: this.spaceDetails._id,
                            name: this.spaceDetails.name,
                            addons: this.spaceDetails.addons,
                            typ: this.spaceDetails.typ,
                            indoor: this.spaceDetails.indoor
                        }]
                    }
                }]
    },
    space:this.spaceDetails,
    startTime: this.startTime,
    priority: this.priority,
    days: this.days,
    description: this.description,
    attendance: this.attendance,
    sport: this.sport?this.sport:'Basketball',
    uid: this.uid?this.uid:localStorage.getItem('id'),
    registration:{
      link: this.link,
      capacity: this.capacity,
      description: this.assignDescription
    },
    internal: this.internal,
    group: this.group,
  };
}

convertTime(time: number): string {
  return this.commonService.convertToNormalHourFormat(time);
}
selectAll() {
  this.checkAll = !this.checkAll;
   this.spaceDetails.pricing.forEach((pricing: any) => {
    pricing.checked = this.checkAll;
  });
  this.checkValues();
}
viewHomePage(){
  this.router.navigate(['/']);
}
preventStringInput(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const dateValue = new Date(inputElement.value);
  if (isNaN(dateValue.getTime())) {
    inputElement.value = '';
  }
}

}
