import { Component, Input } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { BookingInboxDTO } from 'src/app/models/org';
import { convertToTimeSlot, getFormattedDate, isUpcoming } from 'src/app/utils/utils';
import { BookingRequestPopupComponent } from '../../../booking-request-popup/booking-request-popup';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-booking-line-grouped',
  templateUrl: './booking-line-grouped.html',
  styleUrls: ['./booking-line-grouped.css']
})
export class BookingLineGroupedComponent {
  @Input() booking!: BookingInboxDTO;
  formattedDay = '';
  bookingStatus = this.appConst.BOOKING_STATUS;
  constructor(
    private appConst : AppConst,
    private dialog: MatDialog,
    private commonService: CommonService
  ){

  }
  ngOnInit() {
    this.setUpcoming(this.booking);
    this.formattedDay = getFormattedDate(new Date(this.booking.eventDate));
  }
  viewBooking(bookingDetails : BookingInboxDTO){
    this.dialog.open(BookingRequestPopupComponent,{
      width:'100%',
      maxWidth: '95vw',
      position:{top:'20px'},
      data: bookingDetails
    });
  this.commonService.setBookingApprovalDetails(bookingDetails);
  }
  changeTimeFormat(time: number): string {
    return convertToTimeSlot(time);
}
totalHours(startTime: number, endTime: number): number {
  const start = startTime;
  const end = endTime;
  return end - start;
}
review(booking: BookingInboxDTO): boolean {
  return (booking && booking.status === 1 && booking.upcoming === 1);
}

setUpcoming(booking: BookingInboxDTO): void {
  let date = booking.eventDate;

  if (booking.children?.length) {
    date = booking.endDate;
  }

  booking.upcoming = isUpcoming(date) ? 1 : 0;
}

getStatusTitle(status: number): string {
  const statusObj = this.bookingStatus.find(item => item.value === status);
  return statusObj ? statusObj.title : 'Unknown';
}



}
