import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppConst } from 'src/app/app.const';
import { AddonsDTO } from 'src/app/models/booking';
import { SpaceDTO } from 'src/app/models/search';
import { CommonService } from 'src/app/services/common.service';
import { CartDTO, CartUtils } from 'src/app/utils/cart';
import { basicPluralize, createOptions } from 'src/app/utils/options';
import { CancelingDataComponent } from '../../includes/canceling-data/canceling-data';

@Component({
  selector: 'app-setup-options',
  templateUrl: './setup-options.html',
  styleUrls: ['./setup-options.css']
})
export class SetupOptionsComponent implements OnInit {
  spaceDetails!: SpaceDTO;
  cartDetails!: CartDTO;
  bookingOptionsForm!: FormGroup;
  addonPriceBases = this.appConst.addonPriceBases;
  addons: AddonsDTO[] = [];
  selectedType = '';
  constructor(
    private commonService:CommonService,
    private appConst: AppConst,
    private dialog: MatDialog,
    private cartService: CartUtils,
  ) {}


  ngOnInit(): void {
     this.commonService.cartDetails$.subscribe((data)=>{
      this.cartDetails = data;
     });
     this.commonService.spaceDetails$.subscribe((data)=>{
      this.spaceDetails = data;
      this.cartDetails.booking.status = this.spaceDetails.IsRefundable?2:1;
     });
     this.setSpaceValues();
  }
  setSpaceValues() {
    if (this.spaceDetails.typ?.length === 1) {
        this.cartDetails.booking.typ = this.spaceDetails.typ[0];
    }
    this.cartDetails.booking.options = this.cartDetails.booking.options || [];

    if (!this.cartDetails.booking.cost) {
        //  this.cartDetails.booking.cost = { optionsTotal: 0 };
    } else if (!this.cartDetails.booking.cost.optionsTotal) {
        this.cartDetails.booking.cost.optionsTotal = 0;
    }

    if ((this.spaceDetails.addons ?? []).length > 0) {
      this.spaceDetails.addons?.forEach((a: any) => {
          if (a.enabled) {
              a.selected = false;
              this.addonPrice(a);
              const ix = this.cartDetails.booking.options.findIndex((option: any) => option._id === a._id);
              a.selected = a.include || (ix >= 0);
              if (a.selected && ix < 0) {
                  this.cartDetails.booking.options.push(a);
              }
              this.addons.push(a);
          }
      });
  }

}
addonPrice(addon: AddonsDTO) {
  let priceLabel = '';
  if (addon.price === 0) {
    priceLabel = this.handleFreeAddon(addon);
  } else if (addon.basis === this.addonPriceBases[0]) {
    priceLabel = this.calculatePriceBasedOnBasis(addon);
  } else {
    priceLabel = this.calculatePriceBasedOnHours(addon);
  }

  addon.displayPrice = priceLabel;
}

handleFreeAddon(addon: AddonsDTO): string {
  addon.subtotal = 0;
  return 'Free';
}

calculatePriceBasedOnBasis(addon: AddonsDTO): string {
  addon.subtotal = addon.price ?? 0;
  const count = this.cartDetails.booking.children?.length ?? 1;
  let priceLabel = `$${addon.subtotal}`;

  if (addon.perItem) {
    priceLabel += ' ea.';
  }

  if (count > 1) {
    addon.subtotal *= count;
    priceLabel += `/use x ${count} days`;
  }

  if (addon.perItem && addon.use) {
    addon.subtotal *= parseInt(addon.use, 10) || 1;
  }

  return priceLabel;
}

calculatePriceBasedOnHours(addon: AddonsDTO): string {
  let hours = this.getBookingHour();
  addon.subtotal = (addon.price ?? 0) * hours;
  const multiplier = this.getMultiplier(addon.basis);
  addon.subtotal *= multiplier;

  if (addon.selectLength) {
    hours = this.handleSelectLength(addon, hours, multiplier);
  }

  let priceLabel = `$${addon.price} ${addon.basis}`;
  if (!addon.selectLength) {
    priceLabel += ` x ${hours} ${basicPluralize(hours, 'hr')}`;
  }

  if (addon.perItem && addon.use) {
    addon.subtotal *= parseInt(addon.use, 10) || 1;
    priceLabel += ' ea.';
  }

  return priceLabel;
}

getBookingHour(): number {
  let hours = this.cartDetails.booking.cost?.count ?? 0;
  if (this.cartDetails.booking.pricing && this.cartDetails.booking.pricing.length > 0) {
    hours = this.cartDetails.booking.cost?.totalHours ?? hours;
  }
  return hours;
}

handleSelectLength(addon: AddonsDTO, hours: number, multiplier: number): number {
  if (this.cartDetails.booking.children?.length > 1) {
    let maxBlocks = 0;
    this.cartDetails.booking.children.forEach((child: any) => {
      maxBlocks = Math.max(maxBlocks, (child.blocks?.length ?? 0) / (this.cartDetails.booking.divisor || 1));
    });
    hours = maxBlocks;
  }

  addon.blocks = createOptions(hours, multiplier);
  addon.duration = addon.blocks[addon.blocks.length - 1];

  return hours;
}

getMultiplier(basis = '') {
  switch (basis) {
      case this.addonPriceBases[2]:
          return 2;
      case this.addonPriceBases[3]:
          return 4;
      default:
          return 1;
  }
}  shouldShowAddon() {
    return true;
  }

  updateOptionsTotal() {
    let total = 0;

    this.addons.forEach((addon) => {
      const itemIndex = this.findAddonInCart(addon);
      if (addon.selected) {
        addon.subtotal = this.calculateAddonSubtotal(addon);

        if (itemIndex === -1) {
          this.cartDetails.booking.options.push(addon as any);
        } else {
          this.cartDetails.booking.options[itemIndex].subtotal = addon.subtotal;
        }

        if (addon.subtotal) {
          total += parseFloat(addon.subtotal);
        }
      } else {
        this.removeAddonFromCart(itemIndex);
      }
    });

    this.finalizeOptionsTotal(total);
  }

  findAddonInCart(addon: AddonsDTO): number {
    return this.cartDetails.booking.options.findIndex((o) => o._id === addon._id);
  }

  calculateAddonSubtotal(addon: AddonsDTO): number {
    let subtotal = addon.price ?? 0;

    if (addon.basis === this.addonPriceBases[0]) {
      subtotal = this.calculatePerItemSubtotal(addon, subtotal);
    } else {
      subtotal = this.calculateHourlySubtotal(addon, subtotal);
    }

    return subtotal;
  }

  calculatePerItemSubtotal(addon: AddonsDTO, subtotal: number): number {
    if (addon.perItem && addon.use) {
      subtotal *= parseInt(addon.use, 10);
    }
    const childCount = this.cartDetails.booking.children?.length ?? 1;
    subtotal *= childCount;
    return subtotal;
  }

  calculateHourlySubtotal(addon: AddonsDTO, subtotal: number): number {
    const hours = this.getBookingHours();
    const multiplier = this.getMultiplier(addon.basis);

    if (addon.perItem && addon.use) {
      subtotal *= parseInt(addon.use, 10);
    }

    if (addon.selectLength) {
      subtotal *= addon.duration.value ?? 1;

      if (this.cartDetails.booking.children?.length > 1) {
        subtotal *= this.cartDetails.booking.children.length;
      }
    } else {
      subtotal *= hours * multiplier;
    }

    return subtotal;
  }

  getBookingHours(): number {
    let hours = this.cartDetails.booking.cost?.count ?? 0;
    if (this.cartDetails.booking.pricing && this.cartDetails.booking.pricing.length > 0) {
      hours = this.cartDetails.booking.cost?.totalHours ?? hours;
    }
    return hours;
  }

  removeAddonFromCart(itemIndex: number) {
    if (itemIndex >= 0) {
      this.cartDetails.booking.options.splice(itemIndex, 1);
    }
  }

  finalizeOptionsTotal(total: number) {
    this.cartDetails.booking.options.sort((a, b) => (a.subtotal ?? 0) - (b.subtotal ?? 0));
    this.cartDetails.booking.cost.optionsTotal = total;
    this.cartService.processBooking?.calculate();
    this.commonService.storeCartDetails(this.cartDetails);
}
toggleAddon(addon: any, event: Event) {
  const inputElement = event.target as HTMLInputElement;
  addon.selected = inputElement.checked;
  this.updateOptionsTotal();
}
 
  reverse(){
    this.commonService.setBookingPageStatus(this.appConst.bookPage)
  }

  cancel(){
   this.dialog.open(CancelingDataComponent, {
      width: '320px',
      position :{top:'10px'},
    });
  }

  forward(){
    this.commonService.setBookingPageStatus(this.appConst.bookingPayment);
  }
}
