import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AppConst } from 'src/app/app.const';
import { CommonService } from 'src/app/services/common.service';
import { CartDTO, CartUtils } from 'src/app/utils/cart';

@Component({
  selector: 'app-canceling-data',
  templateUrl: './canceling-data.html',
  styleUrls: ['./canceling-data.css']
})
export class CancelingDataComponent  implements OnInit{
  cart! : CartDTO;
constructor(
  private dialogRef : MatDialogRef<CancelingDataComponent>,
  private commonService: CommonService,
  private appConst : AppConst,
  private cartService: CartUtils
){

}

ngOnInit(){
  this.commonService.cartDetails$.subscribe((data) => {
    if (data) {
      this.cart = data;
    }
  });
}
  dismissPopup(){
   this.dialogRef.close();
  }
  update(){
    this.cart.booking.children = [];
    this.cart.error.days = [];
    this.commonService.storeCartDetails(this.cart);
    this.commonService.setBookingPageStatus(this.appConst.bookingSchedule);
    this.dialogRef.close();
    this.cartService.cancel(this.cart);
    this.cartService.processBooking.calculate();

  }
}
