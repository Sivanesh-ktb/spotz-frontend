import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SpaceService } from "src/app/services/space.service";
import { Helpers } from "src/app/helpers/helper";
import { AddOn, Deposit } from "src/app/models/space";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'app-space-settings',
  templateUrl: './space-settings.html',
  styleUrls: ['./space-settings.css']
})
export class SpaceSettingsComponent implements OnInit {
  orgId = '';
  facId = '';
  spaceId = '';
  displayName = '';
  hideRental  = true;
  selectedOptionValue = 1;
  spaceDetails: any;
  showBuffer = false;
  bufferBeforeValue = 0;
  bufferAfterValue = 0;
  rentalBlockTime = '';
  showAddOns = false;
  saveAddOns = true;
  addOns: AddOn[] = [];
  deposits : Deposit[] = [];
  spaceIsRefundable  = false;
  checkIsRefundable !: boolean;
  facName  = '';
timeBlocks : any = [];
pricingDetails : any = [];
  constructor(
    private route: ActivatedRoute,
    private spaceService: SpaceService,
    private toastr: ToastrService,
    private helper: Helpers,
    private confirmationService : ConfirmationService,

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.facId = paramMap.get('facilityId') ?? '';
      this.spaceId = paramMap.get('spaceId') ?? '';
      if (this.spaceId) {
        this.getSettingsSpaceDetails();
      }
    });
  }

  getSettingsSpaceDetails() {
    this.spaceService.getSpaceDetails(this.spaceId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.spaceDetails = response.body;
          this.selectedOptionValue = this.spaceDetails?.rental?.block;
          this.bufferBeforeValue = this.spaceDetails?.rental?.buffer[0]?.before;
          this.bufferAfterValue = this.spaceDetails?.rental?.buffer[0]?.after;
          this.rentalBlockTime = this.getRentalBlock();
          this.addOns = response.body?.addons;
          this.deposits = response.body?.deposits;
          this.spaceIsRefundable = this.spaceDetails?.IsRefundable;
          this.checkIsRefundable = this.spaceDetails?.IsRefundable;
          const facUrl = this.spaceDetails?.fac?.gdUrl;
          this.facName =  facUrl.substring(facUrl.lastIndexOf('/') + 1);
        } else {
          this.toastr.error(response.body.message);
        }
      }
    );
  }

  updateSpaceRentalSetting(status: number) {
    if (this.spaceId) {
      this.spaceService.updateSpaceDetails(this.spaceId, this.spaceDetails).subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.toastr.success('Space Saved' + ' ' + this.spaceDetails?.name);
            if(status === 1)
            {
              this.hideRental = true;
            }
            return this.getSettingsSpaceDetails();
          } else {
            return this.toastr.error(response.body.message);
          }
        }
      );
    } else {
      this.toastr.error('Space not found');
    }
  }

  getRentalBlock() {
    switch (this.selectedOptionValue) {
      case 1:
        return this.helper.rentalTimeOne;
      case 2:
        return this.helper.rentalTimeTwo;
      case 4:
        return this.helper.rentalTimeThree;
      default:
        return this.helper.rentalTimeOne;
    }
  }
  updateAddonsDetails(status: number, addOns: any) {
    this.spaceDetails.addons = addOns;
    this.spaceDetails.addons = addOns;
    return this.updateSpaceRentalSetting(status);
  }
updateSpaceRefundable(isRefundable : boolean){
  this.spaceDetails.IsRefundable = isRefundable;
  return this.updateSpaceRentalSetting(5);
}
onSelectedOption(event: any) {
  this.selectedOptionValue = event;
  this.spaceDetails.rental.block = this.selectedOptionValue;
  this.updateSpaceRentalSetting(1);
}
OnTimeBlockTemplateDetails(event: any) {
  this.pricingDetails = event;
  this.spaceDetails.pricing = this.pricingDetails;
  this.updateSpaceRentalSetting(2);
}
onHourlyUpdate(event: boolean) {
  this.spaceDetails.hourly = event;
  this.updateSpaceRentalSetting(3);
}
}
