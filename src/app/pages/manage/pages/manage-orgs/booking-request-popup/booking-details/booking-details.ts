import { Component } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { BookingInboxDTO } from 'src/app/models/org';
import { CommonService } from 'src/app/services/common.service';
import { convertToTimeSlot } from 'src/app/utils/utils';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.html',
  styleUrls: ['./booking-details.css',
    '../booking-request-popup.css'
  ]
})
export class BookingDetailsComponent {
  bookingDetails!: BookingInboxDTO | null;
  bookingStatus = this.appConst.BOOKING_STATUS;
  constructor(
    private appConst: AppConst,
    private commonService: CommonService
  ){

  }
  ngOnInit() {
    this.commonService.bookingApprovalDetails$.subscribe((data: BookingInboxDTO | null) => {
      console.log('data', data);
      this.bookingDetails = data;
      // this.toggleStatus(this.bookingDetails.status);
    });
  }
  changeTimeFormat(time: number): string {
    return convertToTimeSlot(time);
}
  isApproved = true;

  toggleStatus(status: string): void {
    if (status === this.appConst.BOOKING_STATUS_DENIED) {
      this.isApproved = false;
    } else if (status === this.appConst.BOOKING_STATUS_APPROVED) {
      this.isApproved = true;
    }
  }
  getStatusTitle(status: number): string {
    const statusObj = this.bookingStatus.find(item => item.value === status);
    return statusObj ? statusObj.title : 'Unknown';
  }
}
