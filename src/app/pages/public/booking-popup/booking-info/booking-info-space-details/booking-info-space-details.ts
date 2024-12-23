import { Component, Input } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { AddOnDTO, SpaceDTO } from 'src/app/models/space';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-booking-info-space-details',
  templateUrl: './booking-info-space-details.html',
  styleUrls: ['./booking-info-space-details.css']
})
export class BookingInfoSpaceDetailsComponent {

  @Input() spaceDetails?: SpaceDTO ={};
  @Input() amenities? : string[];
  @Input() freeAddons! : AddOnDTO[];
  @Input() paidAddons! : AddOnDTO[];
  indoor = this.appConst.INDOOR;
  outdoor = this.appConst.OUTDOOR;
  price = this.spaceDetails?.price || 0;
  constructor(
    public appConst : AppConst,
    public commonService: CommonService
  ) {}

  convertToTimeSlot(time: number) {
    return this.commonService.convertToNormalHourFormat(time);
  }
  totalHours(startTime: number, endTime: number): number {
    const start = startTime;
    const end = endTime;
    return end - start;
  }
  getShortDayNames(fullDays: string[]): string {
    return fullDays
      .map(day => this.appConst.DAY_ABBREVIATIONS[day as keyof typeof this.appConst.DAY_ABBREVIATIONS] || day)
      .join('-');
  }


}
