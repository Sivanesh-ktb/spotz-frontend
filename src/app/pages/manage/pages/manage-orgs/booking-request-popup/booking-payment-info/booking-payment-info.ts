import { Component } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-booking-payment-info',
  templateUrl: './booking-payment-info.html',
  styleUrls: ['./booking-payment-info.css',
    '../booking-request-popup.css'
  ]
})
export class BookingPaymentInfoComponent {
  cartDetails = this.appConst.CART_DETAILS;
  transactionTab = this.appConst.TRANSACTION_TAB;
constructor(
  private appConst: AppConst
){

}
  activeTab1 = this.cartDetails;
  setActiveTab1(tabId: number): void {
    this.activeTab1 = tabId;
  }
}
