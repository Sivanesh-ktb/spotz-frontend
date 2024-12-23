import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { BookingDoneDTO } from 'src/app/models/booking';
import { AppConst } from 'src/app/app.const';
import { CartDTO, CartUtils } from 'src/app/utils/cart';

@Component({
  selector: 'app-booking-done',
  templateUrl: './booking-done.html',
  styleUrls: ['./booking-done.css']
})
export class BookingDoneComponent implements OnInit {
bookingId = '';
BookingDoneDetails : BookingDoneDTO = {};
cart!:CartDTO;
  constructor(
    private matDialog: MatDialog,
    private commonService: CommonService,
    private appConst: AppConst,
    private cartService: CartUtils
  ){

  }
  ngOnInit(){
    this.commonService.setBooking$.subscribe((data)=>{
      if(data){
        this.BookingDoneDetails = data;
      }
    });
    this.commonService.cartDetails$.subscribe((data) => {
      if (data) {
        this.cart = data;
      }
    });
  }
  dismiss(){
    this.matDialog.closeAll();
  }
  findFacility(){
    if(this.cart && this.cart.booking && this.cart.booking.children){
      this.cart.booking.children = [];
      this.cart.error.days = [];
      this.commonService.storeCartDetails(this.cart);
      this.cartService.cancel(this.cart);
      this.cartService.processBooking.calculate();
      }
    this.commonService.callSearchApi(true);
    this.commonService.setBookingPageStatus(this.appConst.bookingSchedule)
  }
}
