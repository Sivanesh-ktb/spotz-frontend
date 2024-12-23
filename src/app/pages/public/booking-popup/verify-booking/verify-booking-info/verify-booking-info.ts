import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TermsOfRentalComponent } from '../terms-of-rental/terms-of-rental';
import { BookingDTO, CartDTO, CartUtils } from 'src/app/utils/cart';
import { OrgDetails } from 'src/app/models/org';
import { SpaceDTO } from 'src/app/models/search';
import { GroupDTO } from 'src/app/models/user';
import { CancelingDataComponent } from '../../includes/canceling-data/canceling-data';
import { CommonService } from 'src/app/services/common.service';
import { AppConst } from 'src/app/app.const';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-verify-booking-info',
  templateUrl: './verify-booking-info.html',
  styleUrls: ['./verify-booking-info.css']
})
export class VerifyBookingInfoComponent implements OnInit {
  booking !: BookingDTO;
  org!: OrgDetails;
  space!: SpaceDTO;
  group !: GroupDTO;
  isCartCheckOut!: boolean;
  cart!: CartDTO;
  session!: Object;
  bookingResponse :any = {};
  constructor(
    private matDialog:MatDialog,
    private cartService:CartUtils,
    private commonService: CommonService,
    private appConst: AppConst,
    private router: Router,
    private route: ActivatedRoute,
    private bookingService : BookingService
  ){

  }

  ngOnInit(){
    this.commonService.cartDetails$.subscribe((data) => {
      if (data) {
        this.cart = data;
        this.booking = this.cart.booking;
        this.session = this.cart.session;
        this.org = this.cart.org;
        this.space = this.cart.space;
        this.group = this.cart.group;
        this.isCartCheckOut = this.cart.isCartCheckOut;
      
      }
    });
    this.commonService.spaceDetails$.subscribe((data) => {
      console.log('Space details: calendar block data', data);
      this.cart.booking.IsRefundable = data.IsRefundable;
      this.cart.booking.status = data.instantBooking?2:1;
      console.log('Space details: calendar block data', this.cart.booking);
    });

  }

  viewTermsOfRental(){
    this.matDialog.open(TermsOfRentalComponent,{
      width:'100%',
      maxWidth: '40vw',
      position:{top:'40px'},

      data:{

      }
    })
  }
  viewSampleWaiver(){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/forms/waiver'], { relativeTo: this.route })
    );
    window.open(url, '_blank');
  }

  cancel(){
    this.matDialog.open(CancelingDataComponent, {
      width: '320px',
      position: { top: '10px' },
    });
  }

  reverse() {
    this.commonService.setBookingPageStatus(this.appConst.bookingPayment);
  }
  bookRental(){
    if(this.booking.terms){
      this.bookingService.bookings(this.booking).subscribe(
        (response: HttpResponse<object>)=>{
         if (response.body ) {
            this.bookingResponse = response.body;
            if(this.bookingResponse?._id){
              console.log(this.bookingResponse._id, 'Booking done');
              this.commonService.setBookingId(this.bookingResponse);
            }
          } else {
            console.log('Booking done, but response body is null');
          }
          this.commonService.setBookingPageStatus(this.appConst.bookingDone);
        }
      )
    }
  }
}
