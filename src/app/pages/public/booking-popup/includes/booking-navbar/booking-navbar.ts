import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { CommonService } from 'src/app/services/common.service';
import { CartDTO } from 'src/app/utils/cart';

@Component({
  selector: 'app-booking-navbar',
  templateUrl: './booking-navbar.html',
  styleUrls: ['./booking-navbar.css']
})
export class BookingNavbarComponent implements OnChanges {
  bookingInfo = this.appConst.bookingInfo;
  bookPage = this.appConst.bookPage;
  bookingSchedule = this.appConst.bookingSchedule;
  bookingUsageDetails = this.appConst.bookingUsageDetails;
  bookingOption = this.appConst.bookingOption;
  bookingPayment = this.appConst.bookingPayment;
  bookingVerify = this.appConst.bookingVerify;
  bookingDone = this.appConst.bookingDone;
  status=this.appConst.bookingInfo;
  cart!: CartDTO;
  activePage !:number;
  notAllowInfo = false;
  @Input() page!: number;
  @Output() currentPage = new EventEmitter<number>();
  infoBtn=false;
  constructor(
    private appConst : AppConst,
    private commonService:CommonService
  ){
  }
  ngOnChanges() {
    this.status = this.page;
    this.getSubjectData();
    if(this.status == this.appConst.bookingInfo){
      this.infoBtn = false;
    }
  }


  viewPage(page:number){
    this.status = page;
    this.currentPage.emit(this.status);
    this.cart.booking.children = [];
    this.commonService.clearCartDetails();
  }
getSubjectData(){
  this.commonService.infoButtonStatus$.subscribe((data)=>{
    this.infoBtn = data;
  });
  this.commonService.bookingPageStatus$.subscribe((data)=>{
    this.activePage = data;
    console.log(this.activePage, 'Active page in booking navbar...');
  })
  this.commonService.cartDetails$.subscribe((data) => {
    if (data) {
      this.cart = data;
    }
  });
  this.commonService.infoPageStatus$.subscribe((data)=>{
    if(data){
      this.notAllowInfo = data;
  }
  });
}

}
