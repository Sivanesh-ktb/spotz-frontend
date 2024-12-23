import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BookingSpaceDTO } from 'src/app/models/search';
import { CommonService } from 'src/app/services/common.service';
import { CartUtils } from 'src/app/utils/cart';
import { checkToday } from 'src/app/utils/utils';

@Component({
  selector: 'app-calendar-item',
  templateUrl: './calendar-item.html',
  styleUrls: ['./calendar-item.scss']
})
export class CalendarItemComponent implements OnInit {
  @ViewChild('coverflowContainer') coverflowContainer!: ElementRef;
  @ViewChild('prevArrow') prevArrow!: ElementRef;
  @ViewChild('nextArrow') nextArrow!: ElementRef;
  coverflowPosition = 0;
  coverflowImages: HTMLElement[] = [];
  spaceAvailability!:BookingSpaceDTO;
  @Input() cal: any;
  @Input() timerange!: number[];
  @Input() summary!: boolean;
  @Output() toggleScoreCard = new EventEmitter<void>();

  PRICE = 15;
  PRICING_LENGTH = 9;
  BUTTON_LENGTH = 40;
  currentTime: any;

  constructor(
    private commonService: CommonService,
    private cart: CartUtils
  ){

  }
  ngOnInit(){
    this.getBookingDetails();
    this.currentTime = checkToday(this.cal.eventDate);
    this.clearAll(true);
    this.initCart();
  }
  getBookingDetails(){
    this.commonService.spaceAvailableDetails$.subscribe((data) => {
      this.spaceAvailability = data;
    });
  }

  unavailableTime(blockObj: any): boolean {
    if (blockObj.avail == null) return true;
    if (blockObj.time <= this.currentTime) return true;
    if (this.cart.session && this.cart.session.email) {
      if (this.cart.group.level) {
        return blockObj.level > this.cart.group.level;
      }
    }
    return false;
  }

  clearAll(init: boolean) {
    if (this.cal.avail) {
      if(this.cal.id){
      const dayIndex = this.cart.findInCart(this.cal.id);
      this.cal.bk = null;
      this.cal.err = false;
      let anySelected = false;
      let first = 0;

      this.cal.avail.forEach((c: any, ix: number) => {
        this.clearItem(dayIndex, c, init);
        if (c.isSelected) {
          anySelected = true;
          first = ix;
          this.cal.bk = this.cal.bk || [];
          this.cal.bk.push(c.time);
        }
        if (first === 0 && c.avail > 0) {
          first = ix;
        }
        if (init) {
          c.lead = this.cart.getLeadTime(this.cal, c);
          c.access = this.cart.getAccess(c.level);
        }
      });

      this.cal.selectedItems = anySelected;
      if (this.cal.pricing) {
        if (init) {
          const first = 0;
          let b = null;
          this.cal.pricing.forEach((p: any, index: number) => {
            p.access = true;
            p.level = 0;
            for (let i = p.startTime; i < p.endTime; i++) {
              const ix = this.cal.avail.findIndex((av: any) => av.time === i);
              if (ix > -1) {
                const block = this.cal.avail[ix];
                if (block.lead) {
                  console.log(203);
                  p.lead = block.lead;
                }
                if (!block.access) {
                  p.access = false;
                }
                p.level = Math.max(block.level, p.level);
              }
            }
            p.isDisabled = false;
            if (p.isSelected) {
              b = p;
            }
            if (p.isSelected && (p.lead || !p.access)) {
              const dI = this.cart.findInCart(this.cal.id);
              for (let i = p.startTime; i < p.endTime; i++) {
                const ix = this.cal.avail.findIndex((av: any) => av.time === i);
                if (ix > -1) {
                  this.cal.avail[ix].isSelected = false;
                  this.cart.removeTime(dI, this.cal.avail[ix], 0);
                }
              }
            }
          });
          if (b) {
            this.setDisabled(this.cal.pricing, b, true);
          }
          this.initPager(this.cal.pricing, first, this.PRICING_LENGTH);
        } else {
          this.cal.pricing.forEach((p: any) => {
            p.isSelected = false;
            p.isDisabled = false;
          });
        }
      } else {
        this.initPager(this.cal.avail, first, this.BUTTON_LENGTH);
      }
    }
    }

    this.cart.processBooking.calculate();
  }

  initPager(arr: any[], first: number, pageLength: number) {
    if (arr.length > pageLength) {
      this.cal.currentPage = this.cal.currentPage || Math.floor(first / 12) || 0;
    }
  }

  clearItem(dayIndex: number, c: any, init: boolean) {
    if (c.isSelected && !init) {
    } else {
      c.isSelecting = false;
      c.isSelected = false;
    }
  }

  itemsSelected() {
  }

  initCart() {
    this.cal.clear = true;
    if (this.cal.avail) {
      const dayIndex = this.cart.findInCart(this.cal.id);
      this.cal.avail.forEach((c: any) => {
        if (c.isSelected) {
          this.cal.clear = false;
          this.cart.addTime(dayIndex, c, this.cal.price, this.cal);
        }
      });
      this.cart.processBooking.calculate();
    }
  }

  setDisabled(list: any[], block: any, val: boolean) {
    const selected = list.filter(p => p.isSelected);
    list.forEach((p: any) => {
      p.isDisabled = false;
      selected.forEach((b: any) => {
        if (p.name !== b.name && p.available) {
          if (p.endTime <= b.startTime || p.startTime >= b.endTime) {
            // Allow selection
          } else {
            p.isDisabled = true;
          }
        }
      });
    });
  }
}
