import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { SpaceDTO } from 'src/app/models/space';
import { BookingService } from 'src/app/services/booking.service';
import { CommonService } from 'src/app/services/common.service';
import { PublicService } from 'src/app/services/public.service';
import { StatusCode } from 'src/app/status-code';

interface spaceTypes {
  name: string;
  value: number;
}
@Component({
  selector: 'app-booking-info-header',
  templateUrl: './booking-info-header.html',
  styleUrls: ['./booking-info-header.css']
})
export class BookingInfoHeaderComponent implements OnInit {
  @Input() banner?: string;
  @Input() facDetails!: SpaceDTO[];
  spaceType: number[] = [];
  spaceTypes: spaceTypes[] = [];
  selectedSpace: SpaceDTO = {};
  @Output() spaceSelected = new EventEmitter<SpaceDTO>()

  constructor(
    private appConst: AppConst,
    private commonService: CommonService,
    private bookingService:BookingService,
    private publicService: PublicService
  ) {

  }

  ngOnInit() {
    if (this.facDetails && this.facDetails.length > 0 && !this.selectedSpace || Object.keys(this.selectedSpace).length === 0) {
      this.selectedSpace = this.facDetails[0];
      this.getSpaceTypes();
      this.spaceSelected.emit(this.selectedSpace);
      this.selectSpace(this.selectedSpace);
    }

    this.commonService.selectedSpace$.subscribe(space => {
      this.selectedSpace = space;
    });
  }

  getSpaceTypes() {
    this.spaceType = this.selectedSpace.typ || [];
    if (this.spaceType.length) {
      this.spaceTypes = this.spaceType.map(typeId => {
        const space = this.appConst.SPACES_ENUM.find(data => data.value === typeId);
        return space ? { name: space.name, value: space.value } : { name: 'Unknown', value: typeId };
      });
    } else {
      this.spaceTypes = [];
    }
    console.log(this.spaceTypes, 'Space type names retrieved');
  }

  getSpaceColor(type: number): string {
    return this.appConst.SPACE_COLORS[type] || this.appConst.defaultColor;
  }

  getSpaceTypeName(typeId: number): string {
    const space = this.appConst.SPACES_ENUM.find(space => space.value === typeId);
    return space ? space.name : 'Unknown';
  }

  selectSpace(space: SpaceDTO) {
    this.commonService.setSelectedSpace(space);
    this.selectedSpace = space;
  
    this.spaceSelected.emit(space);
    this.getSpaceTypes();
    if (this.selectedSpace?._id) {
      this.getSpaceDetails(this.selectedSpace._id);
    }
  }
 
  getSpaceDetails(spaceId: string) {
    this.publicService.getSpaceDetails(spaceId).subscribe(
      (response: HttpResponse<object>) => {
        if (response.status == StatusCode.SUCCESS && response.body) {
          this.commonService.setSpaceDetails(response.body as SpaceDTO);
        }
        else {
          console.log('error in getting space details');
        }
      }
    )
  }
}
