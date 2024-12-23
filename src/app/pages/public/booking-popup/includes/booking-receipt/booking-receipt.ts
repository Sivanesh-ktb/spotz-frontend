import { Component, OnInit, Renderer2 } from '@angular/core';
import { BookingSpaceDTO, SpaceDTO } from 'src/app/models/search';
import { CommonService } from 'src/app/services/common.service';
import { CartDTO, CartUtils } from 'src/app/utils/cart';
import { AddOnDTO } from 'src/app/models/space';
import { convertToTimeSlot } from 'src/app/utils/utils';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-booking-receipt',
  templateUrl: './booking-receipt.html',
  styleUrls: ['./booking-receipt.css']
})
export class BookingReceiptComponent implements OnInit {

  spaceAvailabilityDetails!:BookingSpaceDTO;
  selectedSpaceDetails!:SpaceDTO;
  orgName="";
  facName ="";
  checkAvailability = false;
  cart!: CartDTO;
  back ='';
  insurance : number = this.appConst.DEFAULT_RATES.INSURANCE;
  schedulePage !:boolean;
  isOpen = true;
  constructor(
    private commonService: CommonService,
    private renderer: Renderer2,
    private cartService: CartUtils,
    private appConst: AppConst
  ){

  }

  ngOnInit(){
    this.getBookingDetails();
  }
  getBookingDetails(){
    this.commonService.spaceAvailableDetails$.subscribe((data)=>{
      this.spaceAvailabilityDetails = data;
    });
    this.commonService.selectedSpace$.subscribe((data)=>{
      this.selectedSpaceDetails = data;
    });
    this.commonService.selectedOrgName$.subscribe((data)=>{
      this.orgName = data;
    });
    this.commonService.selectedFacName$.subscribe((data)=>{
      this.facName = data;
    });
    this.commonService.setAvailability$.subscribe((data)=>{
      this.checkAvailability = data;
    });
    this.commonService.cartDetails$.subscribe((data) => {
      if (data) {
        this.cart = data;
        console.log(this.cart, 'Updated cart in booking receipt...');
      }
    });
    this.commonService.bookingPageStatus$.subscribe((data) => {
      if(data === this.appConst.bookingSchedule){
        this.schedulePage = true;
      }
    }
  );
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  formatNumber(value: number): string {
    return value.toFixed(2);
  }

  pluralize(value: number, single: string, plural: string): string {
    return value === 1 ? single : plural;
  }

  formatDate(date: Date): string {
    if (date) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
    return '';
  }

  calculateSubtotal(addon: AddOnDTO): string {
    return this.formatCurrency(addon.subtotal || 0);
  }

  getTotalCost(): string {
    if(this.cart?.booking){
      return this.formatCurrency(this.cart.booking.cost.totalHours * this.cart.booking.cost.rateHours.base);
    }
    return '';
  }

  forward() {
    this.back = '';
    const elements = document.querySelectorAll('.animate-switch');
    elements.forEach((element) => {
      this.renderer.removeClass(element, 'back');
    });
    this.commonService.setBookingPageStatus(this.appConst.bookPage)
  }
  removeItem(event: any, index: number): void {
    // Confirmation or additional logic can go here
    if (confirm('Are you sure you want to remove this item?')) {
      this.cart.booking.children.splice(index, 1); // Remove the item from the array
      // Optionally, add more logic like updating totals or sending changes to the server
      console.log(`Item at index ${index} removed`, event);
    }
  }

  submitSchedule() {
    this.cartService.processBooking.submitSchedule();
  }

  changeTimeFormat(time: number): string {
    return convertToTimeSlot(time);
  }
}
