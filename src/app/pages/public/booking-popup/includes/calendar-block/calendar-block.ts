import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { AvailabilityDTO, AvailabilityItemDTO, Block, BlockDTO, BookingSpaceDTO, SpaceDTO } from 'src/app/models/search';
import { CommonService } from 'src/app/services/common.service';
import { getLeadTime, getSelectableElements, offset, setDisabled } from 'src/app/utils/utils';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CartUtils } from 'src/app/utils/cart';
import { box } from 'src/app/models/booking';
@Component({
  selector: 'app-calendar-block',
  templateUrl: './calendar-block.html',
  styleUrls: ['./calendar-block.css',
    '../calendar-item/calendar-item.scss'
  ]
})
export class CalendarBlockComponent implements AfterViewInit, OnInit {
  @Input() timerange!: number[];
  @Input() summary!: boolean;
  spaceAvailability!: BookingSpaceDTO;
  spaceDetails !: SpaceDTO;
  minDate!: Date;
  min!: Date;
  timeSlot!: number;
  calendarItemExecuted = false;
  oneDay = this.appConst.ONE_DAY;
  seconds = this.appConst.SECONDS;
  pricingLength: number = this.appConst.PRICING_LENGTH;
  @Input() cal!: any;
  avail!: any;
  box!: { dimenx1: number, dimenx2: number, dimeny1: number, dimeny2: number };
  readonly PRICING_LENGTH = 9;
  readonly BUTTON_LENGTH = 40;
  readonly NUM_PAGES = 4;

  constructor(
    private commonService: CommonService,
    private appConst: AppConst,
    private el: ElementRef,
    private renderer: Renderer2,
    private cart: CartUtils,
    private cdr: ChangeDetectorRef
  ) {
  }
  ngAfterViewInit(){
    this.cdr.detectChanges();
  }
  ngOnInit() {
    this.avail = [];
    this.getBookingDetails();
    if(this.cal && this.cal.avail && this.cal.avail.length > 0 ){
    for (let time = 0; time < this.cal.avail.length; time++) {
      this.calendarItem(this.cal.avail[time]);
    }
    this.cal.avail = this.avail;
  }
  }

  getBookingDetails() {
    this.commonService.spaceAvailableDetails$.subscribe((data) => {
      this.spaceAvailability = data;
      this.timeSlot = this.spaceAvailability?.data[0]?.spaces[0]?.divisor || 2;
    });
    this.commonService.spaceDetails$.subscribe((data) => {
      this.spaceDetails = data;
      this.cart.booking.IsRefundable = this.spaceDetails.IsRefundable;
      this.cart.booking.status = this.spaceDetails.instantBooking?2:1;
    });
  }

  hover(timeslot: any, val: boolean): void {
    if (timeslot) {
      timeslot.hoverBook = val;
    }
  }

  changeTimeFormat(time: number): string {
    return this.commonService.convertToNormalHourFormat(time);
  }

  timePage(val: number): void {
    const item = this.cal.pricing;
    if (item && item.length > 0) {
      this.cal.pageSize = this.appConst.PRICING_LENGTH;
      if (
        (val === -1 && this.cal.currentPage === 0) ||
        (val === 1 && (this.cal.currentPage + 1) * this.cal.pageSize >= item.length)
      ) {
        return;
      }
    } else {
      this.cal.pageSize = this.appConst.BUTTON_LENGTH;
      if (
        (val === -1 && this.cal.currentPage === 0) ||
        (this.cal.avail &&
          val === 1 &&
          (this.cal.currentPage + 1) * this.cal.pageSize / this.appConst.NUM_PAGES >= this.cal.avail.length) ||
        (this.cal.score &&
          val === 1 &&
          (this.cal.currentPage + 1) * this.cal.pageSize / this.appConst.NUM_PAGES >= this.cal.score.length)
      ) {
        return;
      }
    }
    this.cal.currentPage += val;
  }

  calendarItem(calendar: BlockDTO) {
    if (this.cal.pricing && this.cal.pricing.length > 0) {
      this.cal.pricing.forEach((price: Block) => {
        price.access = true;
        price.level = 0;
        if (typeof price.startTime === 'number' && typeof price.endTime === 'number') {
          for (let index = price.startTime; index < price.endTime; index++) {
            const data = this.cal.avail.findIndex((item: AvailabilityItemDTO) => item.time === index);
            if (data > -1) {
              const block = this.cal.avail[data];

              price.lead = block.lead || price.lead;
              if (!block.access) price.access = false;
              price.level = Math.max(block.level, price.level);
            }
          }
        }
        let selectedPricing = null;
        price.isDisabled = false;

        if (price.isSelected) {
          selectedPricing = price;
          if (price.lead || !price.access) {
            const dI = this.cart.findInCart(this.cal.id);
            if (typeof price.startTime === 'number' && typeof price.endTime === 'number') {
              for (let index1 = price.startTime; index1 < price.endTime; index1++) {
                const data1 = this.cal.avail.findIndex((item: AvailabilityItemDTO) => item.time === index1);
                if (data1 > -1) {
                  this.cal.avail[data1].isSelected = false;
                  this.cart.removeTime(dI, this.cal.avail[data1], 0);
                }
              }
            }
          }
        }
      });
    }

    if (calendar.isSelected) {
      if (calendar.score) {
        const time = calendar.time;
        calendar.av.forEach((day: any) => {
          if (day.pricing && day.pricing.length > 0) {
            const priceIndex = day.pricing.findIndex(
              (value: any) => value.name === calendar.name
            );
            if (priceIndex >= 0) {
              const selectedPricing = day.pricing[priceIndex];
              if (selectedPricing.isSelected) {
                selectedPricing.isSelected = false;
                selectedPricing.isSelecting = false;
                day.pricing.forEach((value: any, price: number) => {
                  if (price !== priceIndex) {
                    value.isDisabled = false;
                  }
                });
              }
            }
          }
          const availIndex = day.avail.findIndex(
            (calendar: any) => calendar.avail === time
          );
          if (availIndex >= 0) {
            const selectedAvail = day.avail[availIndex];
            if (selectedAvail.isSelected) {
              selectedAvail.isSelected = false;
              selectedAvail.isSelecting = false;
              const removeAt = day.bk.indexOf(selectedAvail.time);
              if (removeAt >= 0) day.bk.splice(removeAt, 1);
              if (day.bk && day.bk.length === 0) {
                day.bk = null;
              }
            }
          }
          day.selectedItems = false;
          day.err = false;
        });
      }
      calendar.isSelecting = false;
      calendar.isSelected = false;
    } else {
      calendar.isSelecting = false;
      calendar.isSelected = false;
    }

    if (this.spaceDetails && this.spaceDetails.org && this.spaceDetails.org.leadTime) {
      this.minDate = moment()
        .add(this.spaceDetails.org.leadTime - 1, 'd')
        .toDate();
      calendar.lead = getLeadTime(
        this.cal,
        this.minDate,
        this.timeSlot,
        this.oneDay,
        this.seconds
      );
    }

    calendar.access = true;
    this.avail.push(calendar);
  }

  private startX = 0;
  private startY = 0;
  private firstIndex = -1;
  private isSelected = false;
  private mouseMoveSub: Subscription | null = null;
  private mouseUpSub: Subscription | null = null;
  private buttons: any[] = [];

  onMouseDown(event: MouseEvent, selectedValue: any): void {
    console.log('Mouse down triggered', selectedValue);
    event.preventDefault();
    this.buttons = getSelectableElements(this.el);
    const cal = this.cal;
    let selected = this.cal.selectedItems || false;

    if (!(this.cal.pricing && this.cal.pricing.length > 0)) {
      const anySelected = selectedValue.isSelected;
      selected = anySelected;
      const av = selectedValue;
      selectedValue.isSelected = !av.isSelected;
      console.log('Selection triggered');
      if (this.isSelectable(selectedValue)) {
        this.switchSelecting(selectedValue, true);
      }
      this.calculatePrice(selectedValue);
    } else{
    this.startX = event.pageX;
    this.startY = event.pageY;
    for (let i = 0; i < this.buttons.length; i++) {
      const hitting = this.checkOverlap(
        this.transformBox(event.pageX, event.pageY, event.pageX, event.pageY),
        this.getButtonBox(this.buttons[i])
      );

      if (hitting) {
        this.firstIndex = i;

        if (cal.pricing && cal.pricing.length > 0) {
          const button = this.buttons[i];

          if (!this.buttons[i].disabled) {
            this.switchBlock(selectedValue, cal);
            this.calculatePrice(selectedValue);
          }
          return;
        }
        const av = selectedValue;
        this.isSelected = !av.isSelected;

        }
      }
    }

    // Subscribe to mousemove and mouseup events
    // this.mouseMoveSub = fromEvent(document, 'mousemove').subscribe(
    //   (moveEvent: any) => this.onMouseMove(moveEvent)
    // );
    // this.mouseUpSub = fromEvent(document, 'mouseup').subscribe(() => this.onMouseUp());
  }

  onMouseMove(event: MouseEvent): void {
    event.preventDefault();
    const selectBox = this.transformBox(event.pageX, event.pageY, event.pageX, event.pageY);

    let startIndex = this.firstIndex, endIndex = this.firstIndex;

    const upBlock = false, downBlock = false;
    let notAvailable, msg;

    for (let index = 0; index < this.buttons.length; index++) {
        const buttonBox = this.getButtonBox(this.buttons[index]);
        const hitting = this.checkOverlap(selectBox, buttonBox);

        if (hitting) {
            notAvailable = this.isSelectable(this.buttons[index]);
            msg = '';
            if (index < this.firstIndex) {
                msg = 'user selecting in reverse';
            } else if (index > this.firstIndex) {
                msg = 'user selecting in forward';
            }
            startIndex = (index < startIndex) ? index : startIndex;
            endIndex = (index > endIndex) ? index : endIndex;
            if (!notAvailable) {
                break;
            }
        }
    }
    for (let data = 0; data < this.buttons.length; data++) {
        if (this.isSelectable(this.buttons[data])) {
            this.switchSelecting(this.buttons[data], (data >= startIndex && data <= endIndex));
        }
    }
  }

  onMouseUp(): void {
    this.mouseMoveSub?.unsubscribe();
    this.mouseUpSub?.unsubscribe();
  }

  private checkOverlap(box1: box, box2: box): boolean {
    const horizontalOverlap = box1.dimenx2 >= box2.dimenx1 && box1.dimenx1 <= box2.dimenx2;
    const verticalOverlap = box1.dimeny2 >= box2.dimeny1 && box1.dimeny1 <= box2.dimeny2;
    return horizontalOverlap && verticalOverlap;
}


  private transformBox(startX: number, startY: number, endX: number, endY: number): any {

    const box = { dimenx1: 0, dimenx2: 0, dimeny1: 0, dimeny2: 0 };
    if (startX > endX) {
        box.dimenx1 = endX;
        box.dimenx2 = startX;
    } else {
        box.dimenx1 = startX;
        box.dimenx2 = endX;
    }
    if (startY > endY) {
        box.dimeny1 = endY;
        box.dimeny2 = startY;
    } else {
        box.dimeny1 = startY;
        box.dimeny2 = endY;
    }
    return box;
  }


  private getButtonBox(button:any) {
    const element = button instanceof HTMLElement ? button : button[0];
    const rect = element.getBoundingClientRect();


    return this.transformBox(
        rect.left,
        rect.top,
        rect.left + rect.width,
        rect.top + rect.height
    );
  }

  private isSelectable(timeslot: any): boolean {
    const av = timeslot;
    const lead = !!av.lead;
    if (typeof av.access === 'undefined') {
      return ((av.avail >= 0 || av.opening > 0) && !lead);
    } else {
      return ((av.avail >= 0 || av.opening > 0) && !lead && av.access);
    }
  }

  private switchBlock(selectedValue: Block, cal: AvailabilityDTO) {
    if (selectedValue&& !selectedValue.isDisabled && selectedValue.available) {
      if (!selectedValue.isSelected) {
        this.switchAll(selectedValue, cal, true);
      } else {
        this.switchAll(selectedValue, cal, false);
      }

    }
  }

  switchAll(block: Block, cal: AvailabilityDTO, val: boolean ): void {
    block.isSelected = val;
    if (cal.avail) {
      cal.avail.forEach(function (av: any) {
        const isAvailable = av.avail > 0 &&
          block.startTime !== undefined && av.avail >= block.startTime &&
          block.endTime !== undefined && av.avail < block.endTime;
        if (isAvailable) {
          av.isSelected = val;
          av.isSelecting = false;
        }
      });
    } else {
      if(cal.av){
        cal.av.forEach(function (day: any) {
          const skip = false;
          let pricing: Block;
          if(day.pricing){
            day.pricing.forEach(function (price: Block) {
              if (price.name === block.name) {
                pricing = price;
              }
            });
          }

          if ((val && !skip) || !val) {
            day.avail.forEach(function (av: any) {
              const isAvailable = av.avail > 0 &&
                pricing?.available &&
                !pricing?.isDisabled &&
                !pricing?.lead &&
                pricing?.access &&
                av.avail >= (pricing?.startTime ?? 0) &&
                av.avail < (pricing?.endTime ?? 0);
              if (isAvailable) {
                av.isSelected = val;
                av.isSelecting = false;
              }
            });
            let isSelected = false;
            if (day.pricing) {
              day.pricing.forEach(function (price: Block) {
                if (price.name === block.name) {
                  if (!val && price.isSelected) {
                    price.isSelected = val;
                    price.isSelecting = false;
                  } else if (val && price.available && !price.isDisabled && !price.lead && price.access) {
                    price.isSelected = val;
                    isSelected = true;
                  }
                } else {
                  if (price.isSelected) {
                    isSelected = true;
                  }
                }
              });
              setDisabled(day.pricing);
            }
            if (!isSelected) {
              day.bk = null;
              day.selectedItems = false;
              day.err = false;
            }
          }
        });
      }
      if(Array.isArray(cal.score)){
        setDisabled(cal.score);
      }
    }
    setDisabled(cal.pricing);
  }

  scoreItem(score: any): string {
    return 'score-' + Math.round((score.opening / (score.opening + score.conflict)) * 10);
  }

  showLater(): boolean {
    const length = this.cal.pricing && this.cal.pricing.length > 0 ? this.PRICING_LENGTH : this.BUTTON_LENGTH / this.NUM_PAGES;
    return (
      (this.cal.avail && (this.cal.currentPage + 1) * length < this.cal.avail.length) ||
      (this.cal.score && (this.cal.currentPage + 1) * length < this.cal.score.length)
    );
  }

  toggleAllTimes(timeslot: any): void {
    timeslot.isSelected = !timeslot.isSelected;
    if (timeslot.isSelected) {
      this.cal.selectedItems = true;
    }
    const time = timeslot.time;
    this.cal.av.forEach((c: any) => {
      const ix = c.avail.findIndex((av: any) => av.avail === time);
      if (ix >= 0) {
        const dayIndex = this.cart.findInCart(c.id);
        if (c.avail[ix].isSelected && !timeslot.isSelected) {
          c.avail[ix].isSelected = false;
          this.cart.removeTime(dayIndex, c.avail[ix], c.price);
        } else if (!c.avail[ix].isSelected && timeslot.isSelected) {
          c.avail[ix].isSelected = true;

          this.cart.addTime(dayIndex, c.avail[ix], c.price, c);
        }
      }
    });
    this.cal.selectedItems = false;
    this.cart.processBooking.calculate();
  }

  calculatePrice(selectedValue: Block): void {
    const cal = this.cal;
    let dayIndex: number;
    const buttons = cal.pricing && cal.pricing.length > 0 ? cal.av : cal.score;

    if (cal.score) {
      if (cal.pricing && cal.pricing.length > 0) {
        buttons.forEach((day: any) => {

          dayIndex = this.cart.findInCart(day.id);

          day.avail.forEach((a: AvailabilityItemDTO) => {
            if (a.isSelected) {
              dayIndex = this.cart.addTime(dayIndex, a, cal.price, day);
              day.bk = day.bk || [];
              day.bk.push(a.time);
            } else {
              this.cart.removeTime(dayIndex, a, cal.price);
              if (day.bk) {
                const removeAt = day.bk.indexOf(a.time);
                if (removeAt > -1) {
                  day.bk.splice(removeAt, 1);
                  if (day.bk.length === 0) {
                    day.bk = null;
                    day.selectedItems = false;
                  }
                }
              }
            }
          });
          day.err = this.cart.checkDaily(dayIndex);
          if(day.pricing){
            const pricing = day.pricing.find((price: Block) => price.isSelected);

            if (pricing) {
                day.pricing.forEach((price: Block) =>{
                    if (price.isSelected) {
                        this.cart.addBlock(dayIndex, price,cal);
                    } else {
                        this.cart.removeBlock(dayIndex, price);
                    }
                });
            }
          }
        });
      }else{
        const scoreData = cal.score;
        for (let score = 0; score < buttons.length; score++) {
            var btn = buttons[score];
            cal.av.forEach((day : any) => {
                this.calculateDay(day, btn, btn.time, cal);
            });

        }
      }
    }else{
      dayIndex = this.cart.findInCart(cal.id);
      const booking = [];
      const buttons = cal.avail;
      for (let index = 0; index < buttons.length; index++) {

        const block = buttons[index];
        if (selectedValue.isSelected) {
          dayIndex = this.cart.addTime(dayIndex, selectedValue, cal.price, cal);
          booking.push(block.time);
        } else {
          const day = this.cart.booking.children[dayIndex];
           dayIndex = this.cart.removeTime(dayIndex, selectedValue, cal.price);

            if (dayIndex === -2) {
              this.cart.cleanup(day);
                break;
            }
          }
      }
      this.checkPricing(cal, dayIndex);

      const err = this.cart.checkDaily(dayIndex);

      cal.bk = (booking.length > 0) ? booking : null;
      cal.err = err;
    }
    this.cart.processBooking.calculate();
  }

  calculateDay(day: any, button: any, time: any, cal: any): void {
    let dayIndex = -1;

    const ix = day.avail.findIndex((av: AvailabilityDTO) => av.avail === time);

    if (ix >= 0) {
      dayIndex = this.cart.findInCart(day.id);

      if (day.avail[ix].isSelected && !button.isSelected) {
        day.avail[ix].isSelected = false;
        this.cart.removeTime(dayIndex, day.avail[ix], cal.price);

        const removeAt = day.bk.indexOf(day.avail[ix].time);
        day.bk.splice(removeAt, 1);

        if (day.bk.length === 0) {
          day.bk = null;
          day.selectedItems = false;
          day.err = false;
          dayIndex = -1;
        }
      }
      else if (!day.avail[ix].isSelected && button.isSelected) {
        if (!day.avail[ix].lead) {
          day.avail[ix].isSelected = true;
          dayIndex = this.cart.addTime(dayIndex, day.avail[ix], cal.price, day);

          day.bk = day.bk || [];
          day.bk.push(day.avail[ix].time);
        }
      }
    }

    if (dayIndex >= 0) {
      day.err = this.cart.checkDaily(dayIndex);
    }
  }

  private checkPricing(cal: any, dayIndex: number) {
    const field = 'pricing';
    if (cal[field] && cal[field].length > 0) {
      cal[field].forEach((price: Block, ix: number) => {
       if (price.isSelected) {
                this.cart.addBlock(dayIndex, price,cal);
            } else {
                this.cart.removeBlock(dayIndex, price);
            }
        });
    }
  }

  private switchSelecting(timeslot: Block, endVal: boolean): void {
    const startVal = this.getSelecting(timeslot);
    if (startVal === !endVal) {
      this.setSelecting(timeslot, endVal);
    }
  }

  getSelecting(timeslot: Block) {
    const av = timeslot;
    if (av) {
      return av.isSelecting;
    } else {
      return false;
    }
  }

  setSelecting(timeslot: Block, val: boolean) {
    timeslot.isSelecting = val;
    this.cdr.detectChanges();
  }

  getDisplayedBlocks() {
    const start = this.cal.currentPage * this.PRICING_LENGTH;
    return this.cal.score.slice(start, start + this.PRICING_LENGTH);
  }

  onBlockClick(block: Block) {
    console.log('Block clicked:', block);
    console.log('Block availability:', block.available);
  }
}
