import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddRulePopupComponent } from '../../add-rule-popup/add-rule-popup';
import { ActivatedRoute } from '@angular/router';
import { DeleteAvailabilityComponent } from '../../delete-availability/delete-availability';
import { ToastrService } from 'ngx-toastr';
import { convertToTimeSlot } from 'src/app/utils/utils';

@Component({
  selector: 'app-space-rule-table',
  templateUrl: './space-rule-table.html',
  styleUrls: ['./space-rule-table.css']
})
export class SpaceRuleTableComponent implements OnInit {
@Input() data!: any;
@Input() groupDetails!:any;
@Input() spaceDetails!:any;
  @Input() viewMode: 'list' | 'grid' = 'list';
@Output() refreshData = new EventEmitter();
orgId = '';
editData:any;
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ){

  }
  ngOnInit() :void{
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
    });

  }
  getTotalDays(startDate:string,endDate:string){
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  }

  changeTimeFormat(time: number): string {
    return convertToTimeSlot(time);
}
totalHours(startTime: number, endTime: number): number {
  const start = startTime;
  const end = endTime;
  return end - start;
}
editRule(id:string,type:number){
  this.data.filter((rule:any)=>{
    if(rule._id === id){
      this.editData = rule;
      this.editData.startTime = this.changeTimeFormat(rule.startTime);
      this.editData.endTime = this.changeTimeFormat(rule.endTime);
    }
  }
  );
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '600px';
  dialogConfig.position = {
    top: '10',
  };
  dialogConfig.data = {
    type: type,
    userId: id,
    editData: this.editData,
    orgId: this.orgId,
    groupDetails: this.groupDetails
  };
  const dialogRef = this.dialog.open(AddRulePopupComponent, dialogConfig);
  dialogRef.afterClosed().subscribe();
}
deleteRule(id:string)
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width='400px';
    dialogConfig.position = {
      top:'10'
    }
    dialogConfig.data = {
      id:id,
      orgId: this.orgId
    }
    const dialogRef =this.dialog.open(DeleteAvailabilityComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result=>{
      if(result?.status === 1){
        this.refreshData.emit();
        this.toastr.success('Rule Deleted Successfully');
      }

    })
  }
  formatCompactDate(date: Date): string {
    return `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      date
    )} ${date.getDate()}`;
  }
}
