import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { FacilityDTO } from 'src/app/models/search';
import { AddOnDTO, SpaceDTO } from 'src/app/models/space';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-booking-info',
  templateUrl: './booking-info.html',
  styleUrls: ['./booking-info.css']
})
export class BookingInfoComponent implements OnInit {
  @Input() spaceDetails!: SpaceDTO;
  @Input() facDetails! : SpaceDTO[];
  @Input() banner!: string;
  @Input() row!: FacilityDTO;
  freeAddons! : AddOnDTO[];
  paidAddons! : AddOnDTO[];
  address!: string;
  searchDate!: Date | null;
  selectedSpace : SpaceDTO ={};
  page = this.appConst.BOOKING_INFO_PAGE;
  amenity!: string[];
  @Output() navigateToSchedule = new EventEmitter<void>();
  constructor(
    private appConst: AppConst,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.getAddress();
    this.searchDate = this.commonService.getEventDate();
  }

  onSpaceSelected(space: SpaceDTO) {
    this.selectedSpace = space;
    this.amenity = this.spaceDetails?.fac?.amenity ||[];
    this.findAddons();
  }

  getAddress(){
    this.address = this.row.address.street1 + ', ' + this.row.address.street2 + ', ' +this.row.address.city +', '+
    this.row.address.state+', '+ this.row.address.country +'- ' + this.row.address.zip;
  }

  onNavigateToSchedule(){
    this.navigateToSchedule.emit();
  }

  findAddons() {
    this.freeAddons = [];
    this.paidAddons = [];

    if (this.spaceDetails?.addons) {
      this.spaceDetails.addons.forEach((addon: AddOnDTO) => {
        if (addon.enabled) {
          if (!addon.price || addon.price === 0) {
            this.freeAddons.push(addon);
          } else {
            this.paidAddons.push(addon);
          }
        }
      });
    }

    const sortedFreeAddons = this.freeAddons.sort((a, b) => {
      return (a.name || '').localeCompare(b.name || '');
    });

    const sortedPaidAddons = this.paidAddons.sort((a, b) => {
      return (a.name || '').localeCompare(b.name || '');
    });

    this.freeAddons= sortedFreeAddons;
    this.paidAddons= sortedPaidAddons ;
  }
}
