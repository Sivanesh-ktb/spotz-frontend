import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationPopupComponent } from '../space/space-settings/confirmation-popup/confirmation-popup';
import { AppConst } from 'src/app/app.const';
import { CommonService } from 'src/app/services/common.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-time-block-template',
  templateUrl: './time-block-template.html',
  styleUrls: ['./time-block-template.css']
})
export class TimeBlockTemplateComponent implements OnInit {
  @Input() data!: any;
  @Input() timeBlocks!: any;
  @Output() timeBlockDetails = new EventEmitter<any>();
  @Output() orgTimeBlockDetails = new EventEmitter<any>();
  @Input() showTimeBlock !:boolean;
  @Input() page !: number;
  saveTimeBlock = true;
  orgTimeBlock = false;
  hourly !: boolean;
  orgId  = '';
  pricing = {
    startTime: ''
  };
  times: Array<{ startTime: string, endTime: string }> = [];
  name: string[] = [];
  amount: number[][] = [];
  pricingDetails: any[] = [];
  addPricingDetails: Array<{ amount: number, selectedDays: string[] }> = [];
  days: string[] = this.appConst.allDays;
  selectedDays: string[][] = [];
  allSelected = false;
  weekdaysSelected = false;
  weekendsSelected = false;
  sameDateError = false;
  holiday = false;
  previewOusTimeBlock !:any;
  pricingInfo = this.appConst.pricingInfo;
  constructor(
    private appConst : AppConst,
    private commonService: CommonService,
    private dialog : MatDialog,
  ) {

   }
  ngOnInit(): void {
     if(!this.showTimeBlock){
      this.timeBlocks = this.data?.pricing;
    }
    this.previewOusTimeBlock = this.data?.pricing;
    this.hourly = this.data?.hourly;
    this.timeBlocks.forEach(() => {
      this.times.push({ startTime: '', endTime: '' });
    });

  }
  addTimeBlock() {
    const newTimeBlock = {
      name: '',
      startTime: 0,
      endTime: 0,
      table: [{
        holiday: false,
        amount: 0,
        days: []
      }],
      checked: false,
      available: false,
      additional: false,
      buffer: [],
      errors: []
    };
   this.timeBlocks.push(newTimeBlock);
    if (this.timeBlocks.length > 0) {
        this.addPricingDetails.push({
          amount: 0,
          selectedDays: []
        });
    }
    this.data.pricing = this.timeBlocks;
    this.saveTimeBlock = false;
  }
  onNameInput(index: number) {
    this.timeBlocks[index].name = this.name[index];
  }
pricingRemove(index: number){
  const dialogRef =this.dialog.open(ConfirmationPopupComponent,{
    width:'400px',
    data:{
      name:this.timeBlocks[index].name,
      type:this.appConst.REMOVEPRICINGCONFIRMATION // 2 for remove pricing
    }
  });
  dialogRef.afterClosed().subscribe(result=>{
    if(result?.status === this.appConst.REMOVEPRICINGCONFIRMATION){
      this.timeBlocks.splice(index,1);
      this.addPricingDetails.splice(index,1);
    }
  });
}
pricingDuplicate(index: number){
  this.timeBlocks.push(JSON.parse(JSON.stringify(this.timeBlocks[index])));
}
onAdditionalTime(event: { buffers: { startTime: number, endTime: number }[], index: number,additional:boolean }) {
  this.timeBlocks[event.index].buffer = event.buffers;
  this.timeBlocks[event.index].additional = event.additional;
 }

onSelectedBufferTime(event: { startTime: string, endTime: string }, index: number) {
  if (!this.times[index]) {
    this.times[index] = { startTime: '', endTime: '' };
  }
  this.timeBlocks[index].startTime = this.commonService.convertTo24HourFormat(event.startTime);
  this.timeBlocks[index].endTime = this.commonService.convertTo24HourFormat(event.endTime);
}

onSelectedPricingDays(event: { selectedDays: string[] }, index: number, dayIndex: number): void {
if (!this.selectedDays[dayIndex]) {
    this.selectedDays[dayIndex] = [];
  }
  this.selectedDays[dayIndex] = event.selectedDays;
  if (!this.addPricingDetails[index]) {
    this.addPricingDetails[index] = { amount: 0, selectedDays: [] };
  }
  this.addPricingDetails[index].selectedDays = this.selectedDays[dayIndex];
  if (!this.timeBlocks[index]) {
    this.timeBlocks[index] = { table: [], name: '', startTime: 0, endTime: 0, buffer: [], checked: false, available: false, additional: false, errors: [] };
  }
  if (!this.timeBlocks[index].table[dayIndex]) {
    this.timeBlocks[index].table[dayIndex] = { holiday: false, amount: 0, days: [] };
  }
  this.timeBlocks[index].table[dayIndex].days = this.selectedDays[dayIndex];
  this.validateCalendar(this.timeBlocks[index].table);
}
validateCalendar(table: any[]): void {
  const allDays: string[] = [];
  table.forEach((item) => {
    if (item.days) {
      allDays.push(...item.days);
    }
  });
  const daySet = new Set<string>();
  let hasDuplicates = false;
  const duplicates: string[] = [];
  allDays.forEach(day => {
    if (daySet.has(day)) {
      hasDuplicates = true;
      duplicates.push(day);
    } else {
      daySet.add(day);
    }
  });
  if (hasDuplicates) {
    this.sameDateError = true;
    console.error(`Duplicate days selected: ${duplicates.join(', ')}`);
  } else {
    this.sameDateError = false;
  }
}
removePricing(index: number,dayIndex:number){
  this.timeBlocks[index].table.splice(dayIndex,1);
}
addNewPricingDetails(index: number): void {
  const newPricing = {
    amount: 0,
    days: []
  };
  this.timeBlocks[index].table.push(newPricing);
}

convertTime(time: number): string {
  return this.commonService.convertToNormalHourFormat(time);
}
checkTimeDifference(startTime: number, endTime: number):number {
 return this.commonService.timeDifference(startTime, endTime);
}
  saveBlock(){
    if(this.page === 1){
      this.orgTimeBlockDetails.emit(this.timeBlocks);
      this.orgTimeBlock = true;
    }
    else if(this.page === 2){
     this.timeBlockDetails.emit(this.timeBlocks);
     this.showTimeBlock = false;
    }
  }
  formatAmounts(table: { amount: number }[]): string {
    if (!table || !table.length) {
      return '';
    }
    return table.map(item => `$${item.amount}`).join(', ');
  }


  getFirstLetters(days:[]): string {
    return days.map(day => day[0]).join('-');
  }

  deleteAll(){
    const dialogRef =this.dialog.open(ConfirmationPopupComponent,{
      width:'400px',
      data:{
        type:this.appConst.REMOVEALLPRICINGCONFIRMATION // 3 for remove all pricing
      }
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result?.status === this.appConst.REMOVEALLPRICINGCONFIRMATION){
        this.timeBlocks = [];
        this.timeBlockDetails.emit(this.timeBlocks);
      }
    });
  }
  cancelBlock(){
    this.timeBlocks = [];
    this.showTimeBlock = true;
  }
}
