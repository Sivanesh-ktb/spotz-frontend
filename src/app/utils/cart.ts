import { Injectable } from '@angular/core';
import { officeSpace } from './utils';
import { AddOnDTO } from '../models/space';
import { AppConst } from '../app.const';
import { Info, SpaceDTO, BookingSpaceDTO, Block, AvailabilityDTO } from '../models/search';
import moment from 'moment';
import { CommonService } from '../services/common.service';
import { GroupDTO } from '../models/user';
import { OrgDetails } from '../models/org';
import { PaymentMethodList, SupervisorDTO } from '../models/booking';
import { MatDialog } from '@angular/material/dialog';
import { CancelingDataComponent } from '../pages/public/booking-popup/includes/canceling-data/canceling-data';

@Injectable({
  providedIn: 'root',
})
export class CartUtils {
  public INSURANCE_RATE: number;
  public org! : OrgDetails;
  public space!: BookingSpaceDTO;
  completedStep = 0;
  payment = false;
  showDetails = false;
  bookingCart: any;
  cartList=[];
  public booking!: BookingDTO;
  public selectedGroup = { discount: 0, name: '', id: '' };
  public group !: GroupDTO;
  spaceDetails !: SpaceDTO;
  cart!: CartDTO;
  public impersonate!: boolean;
  public session = { _id: '', email: "", groups: [] , address: {}};
  public bookingProcess!: number;
  public book!: boolean;
  showFull = false;
  error!: ErrorDTO;
  results: Results;
  listing!: ListingDTO;
  taxfees!: number;
  isCartCheckOut = false;
  BookingSearch: any;
  selected!: selectedDTO;
  user: any;

  // repeat: any;
  // cartItemsList: never[];

  constructor(private appConst: AppConst,
    private commonService: CommonService,
    private dialog: MatDialog
  ) {
    this.INSURANCE_RATE = appConst.DEFAULT_RATES.INSURANCE;
    this.error = { days: [] };
    this.commonService.spaceDetails$.subscribe((data) => {
      this.spaceDetails = data;
      this.org = data?.org;
      this.initCart();
    });
    this.results = { none: null, both: false, facs: false, spaceTypes: false };
    this.listing ={
        pricingHtml: 'Here is the pricing info...',
        selectedSpace : {
          id: '',
          name: '',
          IsRefundable: false,
        },
        selectedTime: null
    }
    this.cart = {
      booking: this.booking,
      group: this.selectedGroup,
      completedStep: this.completedStep,
      showDetails: this.showDetails,
      session: JSON.parse(localStorage.getItem('userData') || '{}'),
      book: this.book,
      bookingProcess: this.bookingProcess,
      listing: this.listing,
      error: this.error,
      showFull: this.showFull,
      taxfees: this.taxfees,
      payment: this.payment,
      org: this.org,
      space: this.spaceDetails,
      isCartCheckOut: this.isCartCheckOut
    };
  }

  private initCart() {
    this.book = false;
    this.bookingProcess = 0;
    this.completedStep = 0;
    this.listing = this.listing;
    this.showDetails = true;
    this.group = {
      discount: 0,
      info: null,
      leadTime: this.org?.leadTime,
      level: 0,
      upToDate: false,
      admin: false,
      approver: false,
      taxExempt: false
    };
    this.isCartCheckOut = false;
    this.bookingCart = {};
    this.bookingCart.cartItemsObj = {};

    this.initBookingData();
    this.checkUserGroups();
  }

  public initBookingData() {
    this.commonService.spaceAvailableDetails$.subscribe((space) => {
       this.space = space;
      if (this.space && this.space.data && this.space.data.length > 0) {
        const spaceData = this.space.data[0].spaces[0];
        this.listing = {
          ...spaceData,
          pricingHtml: this.listing.pricingHtml,
          selectedSpace: spaceData || [],
          selectedTime: {
            time: 0
          }
        };
      }
    });
   this.booking = {
      internal: 0,
      status: 0,
      supervisor: {},
      price: '',
      eventName: '',
      typ: '',
      attendance: this.booking?.attendance || 0,
      sport: '',
      otherSport: '',
      terms: false,
      IsRefundable: this.booking?.IsRefundable || false,
      IsStripe: false,
      details: '',
      payment: null,
      cost: {
        rate: this.booking?.cost?.rate || 0,
        count: this.booking?.cost?.count || 0,
        totalHours: this.booking?.cost?.totalHours || 0,
        optionsTotal: this.booking?.cost?.optionsTotal || 0,
        rateHours: {
          base: this.booking?.cost?.rateHours?.base || 0,
          total: this.booking?.cost?.rateHours?.total || 0
        },
        discount: {
          percentage: this.booking?.cost?.discount?.percentage || 0,
          amount: this.booking?.cost?.discount?.amount || 0,
          group: {
            name: '',
            _id: '',
          },
        },
        subtotal: this.booking?.cost?.subtotal || 0,
        fees: {
          tax: this.booking?.cost?.fees?.tax || 0,
          book: this.booking?.cost?.fees?.book || 0,
          insurance: this.booking?.cost?.fees?.insurance || 0,
          tx: this.booking?.cost?.fees?.tx || 0
        },
        txRate: this.booking?.cost?.txRate || 0,
        total: this.booking?.cost?.total || 0,
        taxRate: this.booking?.cost?.taxRate || 0,
      },
      children: this.booking?.children || [],
      blocks: [],
      uid: localStorage.getItem('id') || '',
      insurance: false,
      selectedGroup: null,
      options: [],
      bookingProcess: this.bookingProcess,
      info: {
        s: {
          id: this.spaceDetails?._id || '',
          name: this.spaceDetails?.name,
          price: this.spaceDetails?.price,
          IsRefundable: this.spaceDetails?.IsRefundable || false
        },
        f: {
          id: this.spaceDetails.fac?._id || '',
          name: this.spaceDetails.fac?.name || ''
        },
        o: {
          id: this.spaceDetails.org?._id || '',
          name: this.spaceDetails.org?.name || ''
        }
      },
      lead: {
        min: "",
        timeslot: 0
      },
      divisor: 0,
      eventDate: undefined,
      groups: []
    };

    if (this.listing.selectedTime && this.listing.selectedTime.time) {
      this.selected.start = this.listing.selectedTime.time ;
    }

    this.commonService.eventDate$.subscribe(date => {
      this.booking.eventDate = date;
    });

  }

  private checkUserGroups(): void {
    if (this.session?.email && !this.group.upToDate) {
      this.session.groups.forEach((group: GroupDTO) => {
        if (group.org !== this.org?._id) return;

        let continueLoop = false;

        if (group.system === 1) {
          const authorizedRoles = ['Admin', 'Approver', 'Editor'];

          if (authorizedRoles.includes(group.name || '')) {
            this.group.admin = true;
            this.group.level = 4;
          }

          if (group.name === 'Admin') {
            this.group.approver = true;
          }
        }

        this.checkPermissions.all(group.access);
        if (this.checkPermissions.valid()) {
          continueLoop = true;
        } else if (!this.checkPermissions.results.none) {
          return;
        }

        if (!continueLoop) {
          this.checkPermissions.all(group.access, false);
          if (!this.checkPermissions.valid() && !this.checkPermissions.results.none) {
            this.group.discountError = `${this.group.name} does not have access to this facility for discounts/leadtimes, etc.`;
            return;
          }
        }

        this.booking.groups = this.booking.groups || [];

        if (group.system === 0 && this.groupAccess(group)) {
          const existingGroupIndex = this.booking.groups.findIndex((bg: GroupDTO) => group._id === bg.id);

          if (existingGroupIndex < 0) {
            this.booking.groups.push({
              id: group._id,
              name: group.name,
              discount: group.discount,
            });
          }

          if (group?.discount && this.group?.discount&& (group.discount > this.group.discount)) {
            this.group.discount = group.discount;
            this.group.info = { _id: group._id || '', name: group.name|| '' };
          }

          if (group.invoice && !this.group.info) {
            this.group.info = { _id: group._id || '', name: group.name || '' };
          }

          this.group.leadTime = Math.min(this.group.leadTime || 0, group.lead || 0);
          this.group.level = Math.max(this.group.level || 0, group.level || 0);

          if (group.taxNum === 1) {
            this.group.taxExempt = true;
          }

          if (group.invoice) {
            this.group.invoice = true;
          }
        }
      });

      this.group.upToDate = true;

      if (this.group.discount && (this.group.discount > 0)) {
        this.processBooking.calculate();
      }
    }
  }

  public checkPermissions = {
    results: {} as Results,
    valid: (): boolean => {
      if (!this.results) {
        return false;
      }

      const r = (this.results.both && this.results.facs && this.results.spaceTypes) ||
        (!this.results.both && (this.results.facs || this.results.spaceTypes));
      return r;
    },
    all: (access: string | undefined, isValid = true): boolean => {
      this.results = { both: false, facs: false, spaceTypes: false , none: null};
      if (isValid) {
        access = access || '';

        if (access.indexOf('both') > -1) {
          this.results.both = true;
        }

        if (access.indexOf('facs') > -1) {
          this.results.facs = true;
        }

        if (access.indexOf('spaceTypes') > -1) {
          this.results.spaceTypes = true;
        }
      }
      return true;
    },
  };
  
  private facilityMatch(g: GroupDTO): boolean {
    const typArray = this.space.typ as unknown as number[];
    return typArray.some((t: number) => g.access.spaceTypes.indexOf(Math.floor(t)) > -1);
  }

  private spaceTypeMatch(g: GroupDTO) {
      return g.access.facs.indexOf(this.spaceDetails.fac?._id) > -1;
  }

  private groupAccess(g: GroupDTO) {
      if (g.access && g.access.limited && g.access.limited > 0) {
          if (g.access.typ === 1) {
              return this.spaceTypeMatch(g);
          } else if (g.access.typ === 2) {
              return this.facilityMatch(g);
          } else { /* typ = 3 */
              return (this.spaceTypeMatch(g) && this.facilityMatch(g));
          }
      } 
      return true;
      
  }

  public processBooking = {
    calculate: () => {
      let taxRate = this.org?.salesTax / 100 || 0;

      this.booking = this.booking || { cost : {} };
      this.booking.cost.count = 0;

      this.commonService.spaceDetails$.subscribe((data) => {
        this.spaceDetails = data;
        this.org = data.org;
      });

      if (this.listing.selectedSpace.pricing &&
        this.listing.selectedSpace.pricing.length > 0) {
          let rate = 0;
          let hours = 0;
          this.booking.cost.count = 0;
          this.booking.children.forEach((child: BookingChildDTO) => {
            child.rate = 0;
            const div = child.divisor || 2;
            hours += child.blocks.length / div;

            if (child.pricing) {
              child.pricing.forEach((price: PricingDTO) => {
                if (price.isSelected) {
                  child.rate += price.price;
                }
              });
            }
            rate += child.rate;
          });

          this.booking.pricing = this.listing.selectedSpace.pricing.map((block: Block) => ({
            ...block,
            price: block.price ?? 0,
          })) as unknown as PricingDTO[];
    
          this.booking.cost.rate = rate;
          this.booking.cost.count = this.booking.children.length > 0 ? 1 : 0;
          this.booking.cost.totalHours = hours;
      } else{
        this.booking.children.forEach((child: BookingChildDTO) => {
          const div = child.divisor || 2;

          const hours = child.blocks.length / div;
          this.booking.cost.count += hours;
          this.booking.cost.subtotal += child.rate;
      });

      this.booking.price = '$' + this.booking.info.s.price + '/hr';

      this.booking.cost.rate = this.space.data[0].price;
      }


      if (this.spaceDetails.rentaltypes == 1 && this.spaceDetails.pricing && this.spaceDetails.pricing.length > 0) {
        this.booking.cost.rateHours.base = officeSpace(this.booking.cost.count * this.booking.cost.rate);
        this.booking.cost.rateHours.total = officeSpace(this.booking.cost.count * this.booking.cost.rate);
      }  else {
        this.booking.cost.rateHours.base = officeSpace(this.booking.cost.count * this.booking.cost.rate);
        this.booking.cost.rateHours.total = officeSpace(this.booking.cost.count * this.booking.cost.rate);
      }

      this.booking.cost.discount = {
        percentage: this.selectedGroup ? this.selectedGroup.discount : 0,
        amount: 0
      };

      if(this.space.rentaltypes === 2){
          this.booking.cost.subtotal = this.space.price
      }
      else{
          this.booking.cost.subtotal = this.booking.cost.rateHours.total;
      }

      if (this.booking.cost.discount.percentage > 0) {
        this.booking.cost.discount.amount = officeSpace((this.booking.cost.discount.percentage / 100) * this.booking.cost.subtotal);
        this.booking.cost.subtotal = (this.booking.cost.subtotal - this.booking.cost.discount.amount);
      }

      if (this.selectedGroup) {
        this.booking.cost.discount.group = {
          name: this.selectedGroup.name,
          _id: this.selectedGroup.id
        };
      }

      if (this.booking.cost.optionsTotal != null) {
        const options: OptionItem[] = [];
        this.booking.options.forEach((option: any) => {
          options.push(new OptionItem(option));
        });
        this.booking.cost.options = options;
        if (this.booking.cost.discount.percentage === 100) {
          this.booking.cost.subtotal = 0;
        } else {
          this.booking.cost.subtotal = this.booking.cost.subtotal - this.booking.cost.discount.amount;

        }
      }

      if (this.group.taxExempt) {
        taxRate = 0;
      }

      this.booking.cost.fees = {
        tax: officeSpace(this.booking.cost.subtotal * taxRate),
        book: 0,
        insurance: this.booking.insurance ? this.booking.cost.subtotal * this.INSURANCE_RATE : 0
      };

      if (!this.impersonate && this.booking.cost.count && this.booking.cost.discount.percentage !== 100) {
        if (this.booking.children.length > 1 && this.org.spotzFees) {
          this.booking.cost.fees.book = (this.booking.cost.subtotal * 3) / 100;
        }
        else {
          if (this.org.spotzFees) {
              this.booking.cost.fees.book = (this.booking.cost.subtotal *3)/100;
          }
      }
      }

      this.booking.cost.taxRate = taxRate;
      if (this.org.terms) {
        this.booking.cost.txRate = this.org.terms.tx;
        this.taxfees=this.org.terms.tx*100;
        this.taxfees=Math.floor(this.taxfees*10)/10;
      }

      const total = this.booking.cost.subtotal +
        this.booking.cost.fees.tax +
        this.booking.cost.fees.book +
        this.booking.cost.fees.insurance;


      this.booking.cost.fees.tx = this.org.userFees
        ? total * ((100 * this.org.terms.tx) / (100 - this.org.terms.tx))
        : 0;

      this.booking.cost.total = (total + this.booking.cost.fees.tx + this.booking.cost.optionsTotal);

      this.cart.booking = this.booking;
      this.commonService.storeCartDetails(this.cart);
    },

    setup: () => {
      this.book = true;
      this.booking.uid = localStorage.getItem('id') || '';
      this.booking.children = [];
      this.bookingProcess = 0; // Assuming 0 is the equivalent of BookingSteps.SCHEDULE
      this.processBooking.getCompleted();
    },

    submitSchedule: () => {
      this.processBooking.calculate();
      this.processBooking.setEndDate();
      this.bookingProcess = this.appConst.BOOKING_STEPS.DETAILS
      this.processBooking.getCompleted();
    },

    submitDetails: () => {
      if (this.booking.insurance || this.impersonate) {
        this.processBooking.calculate();
      }

      if (false) {
        this.bookingProcess = 2; // Assuming 2 is the equivalent of BookingSteps.INSURANCE
      } else {
        this.processBooking.setType();
        if (this.processBooking.requiresSetup()) {
          this.bookingProcess = 3; // Assuming 3 is the equivalent of BookingSteps.OPTIONS
        } else if (this.booking.cost.total === 0) {
          this.bookingProcess = 4; // Assuming 4 is the equivalent of BookingSteps.VERIFY
        } else {
          this.bookingProcess = 5; // Assuming 5 is the equivalent of BookingSteps.PAYMENT
        }
      }

      this.processBooking.getCompleted();
    },

    setEndDate: () => {
      // Define logic to set end date here
    },

    setType: () => {
      // Define logic to set booking type here
    },

    requiresSetup: () => {
      return false;
    },

    getCompleted: () => {
      // Define logic to track completed steps here
    },

    cancel : async (results: any, callback?: () => void): Promise<void> => {
      if (this.book && this.bookingProcess >= this.appConst.BOOKING_STEPS.SCHEDULE &&
        this.bookingProcess < this.appConst.BOOKING_STEPS.CONFIRMED && //not done
        this.booking && this.booking.children && this.booking.children.length > 0) {

          const confirm = await this.confirmCancel();
          if (confirm) {
            return this.cancel(this.listing, callback);
          }
      } else if (this.book && this.bookingProcess === this.appConst.BOOKING_STEPS.CONFIRMED) {
        const confirm = await this.confirmCancel();
        if (confirm) {
          return this.cancel(this.listing, callback);
        }
      } else {
          return this.cancel(this.listing, callback);
      }
    },

    back:() =>{
      if (this.shouldCancel(this.bookingProcess)) {
        this.processBooking.cancel({});
      } else {
          let changeTab = (this.bookingProcess - 1);

          if (changeTab === this.appConst.BOOKING_STEPS.PAYMENT && (this.booking.cost.total === 0)) {
              changeTab--;
          }

          if (changeTab === this.appConst.BOOKING_STEPS.OPTIONS && !this.requiresSetup()) {
              changeTab--;
          }

          this.bookingProcess = changeTab;
      }
    },

    pay: (payment: PaymentMethodList) => {
      if (!this.booking.payment) {
        this.booking.payment = {
          amount: 0,
          invoice: 0,
          offline: false,
          billingAddress: {
            firstName: "",
            lastName: "",
            cardholderName: "",
            cardType: "",
            last4: "",
            expirationDate: "",
            expirationMonth: 0,
            expirationYear: 0,
            card_id: ""
          },
          cardType: "",
          last4: "",
          expirationDate: "",
          cardholderName: "",
          expirationMonth: 0,
          expirationYear: 0,
          firstName: "",
          lastName: "",
          imageUrl: "",
          card_id: ""
        }as PaymentMethodList;
       } 

        this.booking.payment = payment;
        this.bookingProcess = this.appConst.BOOKING_STEPS.VERIFY;
        this.getCompleted();
      },

    payCart:(payment: PaymentMethodList) =>{

      if (!this.bookingCart || !this.bookingCart.cartItemsObj || !this.bookingCart.cartItemsObj.cartitem) {
        console.error('Booking cart or cart items are not defined');
        return;
      }

      this.bookingCart.cartItemsObj.cartitem[0]?.s?.forEach((cartItem: any) => {
        this.bookingCart.payment = payment;
        this.bookingCart.payment.amount = null;
        this.bookingCart.payment.invoice = null;
        this.bookingCart.payment.offline = false;
      });
      
      this.bookingProcess = this.appConst.BOOKING_STEPS.VERIFY;
      this.getCompleted();
    },
  }

  getCompleted() {
    this.completedStep = Math.max( this.completedStep,   this.bookingProcess - 1);
  }

  confirmCancel(): Promise<boolean> {
    const dialogRef = this.dialog.open(CancelingDataComponent, {
      width: '320px',
      position :{top:'10px'},
    });

    return dialogRef.afterClosed().toPromise();
  }

  shouldCancel(state: number) {
    return (state === 0);
  }

   requiresSetup() {
    if (this.space.typ && this.space.typ.length > 1) {
        return true;
    } else if (this.space.addons && this.space.addons.length > 0) {
        return this.space.addons.some((addon: any) => addon.enabled);
    } else {
        return false;
    }
  }

  findInCart(calendarId: any) {
    if(this.booking){
      return this.booking.children.findIndex((days: any) => days.id === calendarId);
    }
    return 0;
  }

  getLeadTime(cal: any, block: any): boolean | null {
    if (!block) {
      return null;
    }
    if (block.lead) {
      return block.lead;
    }

    let start, min, diff;
    const ONEDAY = 86400000;

    min = moment(this.booking.lead.min);
    start = min.utcOffset() * 6000;
    diff = moment(cal.date).diff(min);


    const beforeLeadDate = (diff <= start);
    const onLeadDate = (diff < (ONEDAY + start));
    const beforeLeadBlock = (block.time <= this.booking.lead.timeslot);
    return (
      beforeLeadDate ||
      (onLeadDate && beforeLeadBlock)
    );
  }

  getAccess(level: number): boolean {
    return this.group.level ? this.group.level >= level : false;
  }
  
  removeTime(dayIndex: number, block: { avail: number }, price: number) {
    const day = this.booking.children[dayIndex];
    if (day) {
      const ix = day.blocks.indexOf(block.avail);
      if (ix > -1) {
        day.blocks.splice(ix, 1);
        day.rate = price * day.blocks.length / day.divisor;
        if (typeof day.valid === 'boolean') {
          day.valid = (day.blocks.length > 1);
        }
      }
      if (day.blocks.length === 0) {
        this.booking.children.splice(dayIndex, 1);
        dayIndex = -2;
      }
    }
    return dayIndex;
  }

  addTime(dayIndex: number, block: { avail: number }, price: number, cal: any) {
    const divisor = cal.divisor || 2;
    this.booking.divisor = divisor;
    if (dayIndex < 0) {
      this.booking.children.push({
        id: cal.id,
        blocks: [block.avail],
        rate: price / divisor,
        eventDate: cal.date,
        divisor: cal.divisor,
      });
    } else {
      const day = this.booking.children[dayIndex];
      if (day.blocks.indexOf(block.avail) < 0) {
        day.blocks.push(block.avail);
        day.rate = price * day.blocks.length / divisor;
      }
      if(day.blocks[0] != undefined && day.blocks.length > 0){
        day.valid = (day.blocks.length > 1);
      }
      else{
        day.valid = true;
      }
      day.blocks.sort(function (a, b) {
        return a - b;
      });
    }
    this.booking.eventDate = this.booking.children[0].eventDate;
    if (dayIndex < 0) {
      dayIndex = this.booking.children.findIndex((day: BookingChildDTO) => day.id === cal.id);
    }
    return dayIndex;
  }

  checkDaily(dayIndex: number): boolean {
    var start = null, error = false, findDate: number;
    let errorStr = '';
    const day = this.booking.children[dayIndex];
    if (day) {
      for (var index = 0; index < day.blocks.length; index++) {
        const number = day.blocks[index];
        if (!start) {
          start = number;
        }
        else if (number > start + 1) {
          errorStr = 'Please select continuous block of time.';
          error = true;
          if (day.pricing && this.booking.pricing) {
            let validateError = false;
            const totalSlot = this.booking.pricing.map(function (val, index) {
              return val.name;
            });
            const seletedSlot = day.pricing.map(function (val, index) {
              return val.name;
            });
            let continueCheck = 0;
            let isStartingIndex = false;
            for (var index = 0; index < totalSlot.length; index++) {
              if (seletedSlot.includes(totalSlot[index])) {
                const indexValue = totalSlot.indexOf(totalSlot[index]);
                if (isStartingIndex && indexValue != 0 && continueCheck != (indexValue - 1)) {
                  validateError = true;
                }
                console.log(continueCheck + " " + indexValue);
                continueCheck = indexValue;
                isStartingIndex = true;
              }
            }
            if (validateError) {
              errorStr = 'Please select continuous blocks of time.';
              error = true;
            }
            else {
              error = false;
              errorStr = '';
            }
          }
          break;
        }
        else {
          start = number;
        }
      }
       if(day.blocks[0] != undefined && day.blocks.length > 0){
      const min = (day.blocks.length >= day.divisor);
      day.valid = min && !error;
      if (!min && !error) {
        errorStr += 'Please select 1 hour min.';
        error = true;
      }
      day.error = errorStr;
      if (!day.valid) {
        this.error.days = this.error.days || [];
        var findDate = this.errorDate(day);
        if (findDate < 0) {
          this.error.days.push({ date: day.eventDate, error: day.error });
        } else {
          this.error.days[findDate].error = day.error;
        }
      } else if (this.error.days) {
        this.cleanup(day);
      }
    }
    else{
      this.cleanup(day);
    }
    }
    return error;
  }

  cleanup(day: any) {
    const findDate = this.errorDate(day);
    if (findDate >= 0) {
      this.error.days.splice(findDate, 1);
    }
  }

  errorDate(day: BookingChildDTO): number {
    return this.error.days.findIndex((error: { date: string; error: string }) => error.date === day.eventDate);
  }

  addBlock(dayIndex: number, block: any, cal: AvailabilityDTO) {
    if (dayIndex < 0) {
      this.booking.children.push({
        id: cal.id,
        blocks: [block.avail],
        rate: block.table[0].amount,
        eventDate: cal.date,
        pricing: [block],
        divisor: cal.divisor || 2,
        valid: true
      });

    } else {

      const day = this.booking.children[dayIndex];
      if (day && !day.pricing) {
        day.pricing = [];
      }

      if (day && day.pricing) {
        const data = day.pricing.findIndex((price: PricingDTO) => price.name === block.name);

        if (data < 0) {
          day.pricing.push(block);
        }

        day.pricing.sort((item1: PricingDTO, item2: PricingDTO) => item1.startTime - item2.startTime);
      }
    }
  }

  removeBlock(dayIndex: number, block: Block) {

    const day = this.booking.children[dayIndex];
    if (day && day.pricing) {
      const data = day.pricing.findIndex((price: PricingDTO) => price.name === block.name);
      if (data > -1) {
        day.pricing.splice(data, 1);
      }
    }
  }

  cancel(results: any, callback?: () => void): void {
    this.book = false;
    this.booking = {
      internal: 0,
      status: 0,
      supervisor: {},
      price: '',
      eventName: '',
      typ: '',
      attendance: 0,
      sport: '',
      otherSport: '',
      details: '',
      terms: false,
      IsRefundable: false,
      IsStripe: false,
      payment: null,
      cost: {
        rate: 0,
        count: 0,
        totalHours: 0,
        optionsTotal: 0,
        rateHours: {
          base: 0,
          total: 0
        },
        discount: {
          percentage: 0,
          amount: 0,
          group: {
            name: '',
            _id: '',
          },
        },
        subtotal: 0,
        fees: {
          tax: 0,
          book: 0,
          insurance: 0,
          tx: 0
        },
        txRate: 0,
        total: 0,
        taxRate: 0
      },
      children: [],
      blocks: [],
      uid: localStorage.getItem('id') || '',
      insurance: false,
      selectedGroup: null,
      options: [],
      bookingProcess: 0,
      info: {
        s: {
          id: this.spaceDetails._id || '',
          name: this.spaceDetails.name,
          price: this.spaceDetails.price,
          IsRefundable: this.spaceDetails?.IsRefundable || false,
        },
        f: {
          id: this.spaceDetails.fac?._id || '',
          name: this.spaceDetails.fac?.name || ''
        },
        o: {
          id: this.spaceDetails.org?._id || '',
          name: this.spaceDetails.org?.name || ''
        }
      },
      lead: {
        min: "",
        timeslot: 0
      },
      divisor: 0,
      eventDate: undefined,
      groups: []
    };
    this.bookingProcess = 0;
    this.initBookingData();

    this.listing.selectedTime =  null;

    if (results?.av) {
      results.av.forEach((a: any) => {
        a.selectedItems = false;
        a.avail.forEach((avail: any) => {
          avail.isSelected = false;
          avail.isSelecting = false;
        });
      });
    }

    if (results?.score) {
      results.score.forEach((s: any) => {
        s.isSelected = false;
        s.isSelecting = false;
      });
    }
    if (this.BookingSearch) {
      this.BookingSearch.results = results;
    }
    if (callback) {
      callback();
    }
  }
    AddToCart(){
  }
}

export class BookingDTO {
  uid: string;
  children: BookingChildDTO[];
  cost: BookingCostDTO;
  insurance: boolean;
  eventName: string;
  attendance: number;
  terms: boolean;
  IsRefundable: boolean;
  IsStripe: boolean;
  supervisor: SupervisorDTO;
  sport:string;
  otherSport: string;
  details: string;
  typ: any;
  status = 0;
  selectedGroup: GroupDTO | null;
  groups: GroupDTO [];
  price: string | undefined;
  payment!: PaymentMethodList | null;
  options: OptionItem[];
  pricing?: PricingDTO[] | [];
  lead: LeadDTO;
  divisor: number | undefined;
  eventDate: any;
  bookingProcess: number;
  info: Info;
  [key: string]: any; // Allows for additional properties if needed

  constructor(
    uid: string,
    children: BookingChildDTO[],
    cost: BookingCostDTO,
    insurance: boolean,
    pricing: PricingDTO[],
    groups: GroupDTO[],
    terms: boolean,
    IsRefundable: boolean,
    IsStripe: boolean,
    price: '',
    lead: LeadDTO,
    divisor: 2,
    eventDate: null,
    selectedGroup: GroupDTO | null,
    options: OptionItem[],
    bookingProcess: number,
    info: Info,
    eventName: string,
    attendance: number,
    sport: string,
    otherSport: string,
    supervisor: SupervisorDTO | {},
    details: string,
    typ: any
  ) {
    this.uid = uid;
    this.children = children;
    this.cost = cost;
    this.insurance = insurance;
    this.lead = lead;
    this.price = price;
    this.terms = terms;
    this.IsRefundable = IsRefundable;
    this.IsStripe = IsStripe;
    this.groups = groups;
    this.selectedGroup = selectedGroup;
    this.options = options;
    this.pricing = pricing;
    this.eventName = "";
    this.attendance = 0;
    this.sport = "";
    this.otherSport = "";
    this.bookingProcess = bookingProcess;
    this.details = "";
    this.supervisor = {};
    this.typ = [];
    this.info = {
      s: { id: "", name: "", price: 0,IsRefundable: false },
      f: { id: "", name: "" },
      o: { name: "", id: "" }
    };
  }
}

export class BookingChildDTO {
  rate: number;
  divisor: number;
  pricing?: PricingDTO[];
  blocks: any[];
  valid?: any;
  eventDate?: any;
  id?: any;
  errorStr?: string;
  this?: string;
  error?: any;
  constructor(rate: number, divisor: number, pricing: PricingDTO[], blocks: any[], valid: any, eventDate: any, id: any, errorStr: string) {
    this.rate = rate;
    this.divisor = divisor;
    this.pricing = pricing;
    this.blocks = blocks;
    this.valid = valid;
    this.eventDate = eventDate;
    this.id = id;
    this.errorStr = errorStr;
  }
}

export interface LeadDTO {
  timeslot: number;
  min: Date | string;
}

export class PricingDTO {
  isSelected: boolean;
  price: number;
  name?: string;
  startTime: number;
  endTime: number;

  constructor(isSelected: boolean, price: number, name: string, startTime: number, endTime: number) {
    this.isSelected = isSelected;
    this.price = price;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

export class BookingCostDTO {
  rate: number;
  count: number;
  totalHours: number;
  optionsTotal: number;
  rateHours: {
    base: number;
    total: number;
  };
  discount: {
    percentage: number;
    amount: number; // Use number instead of string
    group?: {
      name: string;
      _id: string;
    };
  };
  subtotal: number;
  fees: {
    tax: number;
    book: number;
    insurance: number;
    tx?: number;
  };
  txRate: number;
  taxRate: number;
  total: number;
  options?: OptionItems[];
  [key: string]: any;

  constructor() {
    this.rate = 0;
    this.count = 0;
    this.totalHours = 0;
    this.optionsTotal = 0;
    this.rateHours = {
      base: 0,
      total: 0
    };
    this.discount = {
      percentage: 0,
      amount: 0,
      group: {
        name: '',
        _id: ''
      }
    };
    this.subtotal = 0;
    this.fees = {
      tax: 0,
      book: 0,
      insurance: 0,
      tx: 0
    };
    this.txRate = 0;
    this.total = 0;
    this.taxRate = 0;
  }
}

export class OptionItems {
  name: string;
  price: number;

  constructor(option: any) {
    this.name = option.name || '';
    this.price = option.price || 0;
  }
}

export class OptionItem {
  name: string;
  price: number;
  amount?: number;
  category: string;
  basis: string;
  quantity: number;
  use: string;
  perItem: boolean;
  include: boolean;
  selectLength: boolean;
  duration: string;
  selected: boolean;
  enabled?: boolean;
  typ?: number[];
  description?: string;
  inactive?: number;
  _id: string;
  indoor: string | null;
  subtotal?: number;

  constructor(addon: AddOnDTO) {
    this.name = addon.name ?? '';
    this.price = addon.price ?? 0;
    this.amount = addon.subtotal;
    this.subtotal = addon.subtotal;
    this.indoor = addon.indoor;
    this._id = addon._id;
    this.selected = addon.selected;
    this.category = addon.category ?? '';
    this.basis = addon.basis ?? '';
    this.quantity = addon.quantity ?? 0;
    this.use = addon.use ?? '';
    this.perItem = addon.perItem ?? false;
    this.include = addon.include ?? false;
    this.selectLength = addon.selectLength ?? false;
    this.duration = addon.duration ?? '';
  }
}


export interface  Results {
  none: any; both: boolean; facs: boolean; spaceTypes: boolean 
}

export interface CartDTO{
  book : boolean;
  bookingProcess : number;
  completedStep : number;
  listing : ListingDTO;
  showDetails : boolean;
  group : GroupDTO;
  booking: BookingDTO;
  error: ErrorDTO;
  showFull: boolean;
  taxfees: number;
  payment: boolean;
  org: OrgDetails;
  space: SpaceDTO;
  isCartCheckOut: boolean;
  session: object
}

export interface ListingDTO{
  selectedTime: {
    time: number
  } |null;
  pricingHtml : string;
  selectedSpace: SpaceDTO;
}

export interface ErrorDTO{
  days: { date: string; error: string }[] 
}

export interface selectedDTO{
  start: number;
  end : number;
  days: {
    avail: []
  }
}