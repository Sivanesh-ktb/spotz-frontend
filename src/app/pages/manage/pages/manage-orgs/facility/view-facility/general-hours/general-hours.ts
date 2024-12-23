import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppConst } from 'src/app/app.const';
import { FacilityData, facTimeBlock } from 'src/app/models/facility';
import { FacilityService } from 'src/app/services/facility.service';
import { ConfirmationPopupComponent } from '../../../space/space-settings/confirmation-popup/confirmation-popup';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-general-hours',
  templateUrl: './general-hours.html',
  styleUrls: ['./general-hours.css']
})
export class GeneralHoursComponent {
  @Input() spaceDetails!: object;
  @Input() timeBlocks!: any;
  showTimeBlock = false;
  saveTimeBlock = true;
  orgId = '';
  facilityId = '';
  times: string[] = [];
  pricing = { startTime: '' };
  pricingDetails: any[] = [];
  days: string[] = [];
  allSelected = false;
  weekdaysSelected = false;
  weekendsSelected = false;
  holiday = false;
  timeBlock: facTimeBlock[] = [];
  facilityDetails: FacilityData = {};
  facName="";
  facId="";

  constructor(
    public dialogRef: MatDialogRef<GeneralHoursComponent>,
    private facilityService: FacilityService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appConst: AppConst
  ) {
    this.generateTimes();
    this.facId = data.facId;
    this.orgId = data.orgId;

    if (data.hours) {
      this.timeBlock = data.hours.map((hour: any) => ({
        days: Array.isArray(hour.days) ? hour.days : [hour.days],
        start: hour.start || '',
        end: hour.end || '',
      }));
    }

    if(this.facId){
      this.getFacilityDetails();
    }
  }
  getFacilityDetails() {
    this.facilityService.getOneFacilityDetails(this.facId).subscribe(
      (response: any) => {
        this.facilityDetails = response.body;
        console.log('Facility Details:', this.facilityDetails);
      }
    );
  }

  generateTimes(): void {
    const period = this.appConst.PERIOD;
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 5) {
        const hour = hours % 12 === 0 ? 12 : hours % 12;
        const minute = minutes < 10 ? '0' + minutes : minutes;
        const time = `${hour}:${minute} ${period[Math.floor(hours / 12)]}`;
        this.times.push(time);
      }
    }
  }

  addTimeBlock() {
    if (!this.timeBlock) {
      this.timeBlock = [];
    }
    this.timeBlock.push({
      start: '',
      end: '',
      days: []
    });
  }

  createFacility(): void {
  this.facilityDetails.hours = this.timeBlock;
    this.facilityService
      .updateFacilityOperatingHours(this.orgId, this.facId, this.facilityDetails)
      .subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.toastr.success('Save Success: ' + response.body.name);
            this.dialogRef.close();
            this.timeBlock = response.body.hours?.map((hour: any) => ({
              days: Array.isArray(hour.days) ? hour.days : [hour.days],
              start: hour.start || '',
              end: hour.end || '',
            })) || [];
          }
        },
        error: (err) => {
          this.toastr.error('Failed to update operating hours.' + err.error.message);
        },
      });

    console.log('Formatted Facility Data:', this.facilityDetails); 
  }

  saveTimeBlocks(): void {
    this.createFacility();
  }

  removeTimeBlock(time: any): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      data: {
        type: this.appConst.REMOVE_OPERATING_HOUR_CONFIRMATION,
        name: 'Are you sure?'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === this.appConst.REMOVE_OPERATING_HOUR_CONFIRMATION) {
        const index = this.timeBlock.indexOf(time);
        if (index !== -1) {
          this.timeBlock.splice(index, 1);
        }
      }
    });
  }

  dismiss(): void {
    this.dialogRef.close();
  }
}
