import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConst } from 'src/app/app.const';
import { BookingInboxDTO } from 'src/app/models/org';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-booking-request-popup',
  templateUrl: './booking-request-popup.html',
  styleUrls: ['./booking-request-popup.css']
})
export class BookingRequestPopupComponent implements OnInit {
  message = this.appConst.MESSAGE_TAB;
  paymentInfo = this.appConst.PAYMENT_TAB;
  activeTab= this.message;
  bookingDetails!: BookingInboxDTO | null;
  constructor(
    private appConst: AppConst,
    private matDialog: MatDialog,
    private commonService: CommonService
  ){

  }

  ngOnInit(): void {

    this.commonService.bookingApprovalDetails$.subscribe((data:BookingInboxDTO |null ) => {
      this.bookingDetails = data;
      console.log('data', this.bookingDetails);
    });
  }
  setActiveTab(tabId: number): void {
    this.activeTab = tabId;
  }
  close(){
    this.matDialog.closeAll();
  }
}
