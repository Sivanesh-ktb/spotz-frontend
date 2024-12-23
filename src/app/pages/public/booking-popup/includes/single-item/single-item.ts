import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { AvailabilityListDTO } from 'src/app/models/booking';
import { BookingSpaceDTO } from 'src/app/models/search';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-single-item',
  templateUrl: './single-item.html',
  styleUrls: ['./single-item.css', '../calendar-item/calendar-item.scss']
})
export class SingleItemComponent implements AfterViewInit, OnInit {
  @ViewChild('coverflowContainer') coverflowContainer!: ElementRef;
  @ViewChild('prevArrow') prevArrow!: ElementRef;
  @ViewChild('nextArrow') nextArrow!: ElementRef;
  isloader = false;
  coverflowPosition = 0;
  coverflowImages: HTMLElement[] = [];
  checkAvailability!: boolean;
  spaceAvailability?: BookingSpaceDTO;
  timeRange: number[] = this.appConst.defaultTimeSpan;
  isFetched!: boolean;
  existingAvailability?: BookingSpaceDTO;
  availabilityList: AvailabilityListDTO[] = [];
  constructor(
    private commonService: CommonService,
    private appConst: AppConst,
  ) { }

  ngOnInit() {
    this.getBehaviorDetails();
    this.commonService.searchFacLoader$.subscribe((data) => {
      this.isloader = data;
    });
  }

  ngAfterViewInit() {
    this.initializeCoverflow();
    this.setEventListeners();
  }

  initializeCoverflow() {
    this.coverflowImages = Array.from(this.coverflowContainer.nativeElement.querySelectorAll('.coverflow__image'));
    this.coverflowImages.forEach((day, dayIndex) => {
      day.setAttribute('data-coverflow-index', (dayIndex + 1).toString());
    });
    this.coverflowPosition = this.coverflowImages.length;
    this.updateCoverflowPosition();
  }
  updateCoverflowPosition() {
    this.coverflowContainer.nativeElement.setAttribute('data-coverflow-position', this.coverflowPosition.toString());
  }
  viewPrevImage() {
    this.coverflowPosition = Math.max(1, this.coverflowPosition - 1);
    this.updateCoverflowPosition();
  }
  viewNextImage() {
    this.coverflowPosition = Math.min(this.coverflowImages.length, this.coverflowPosition + 1);
    this.updateCoverflowPosition();
  }
  jumpToDay(index: number) {
    this.coverflowPosition = Math.min(this.coverflowImages.length, Math.max(1, index + 1));
    this.updateCoverflowPosition();
  }
  setEventListeners() {
    this.prevArrow.nativeElement.addEventListener('click', () => this.viewPrevImage());
    this.nextArrow.nativeElement.addEventListener('click', () => this.viewNextImage());
    this.coverflowImages.forEach((image) => {
      image.addEventListener('click', (event: Event) => {
        const target = event.currentTarget as HTMLElement;
        if (target) {
          const index = Number(target.getAttribute('data-coverflow-index')) - 1;
          this.jumpToDay(index);
        }
      });
    });
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.viewPrevImage();
    } else if (event.key === 'ArrowRight') {
      this.viewNextImage();
    }
  }

  getBehaviorDetails() {

    this.commonService.setAvailability$.subscribe((data) => {
      this.checkAvailability = data;
    });
    this.commonService.spaceAvailableDetails$.subscribe((data) => {
      this.spaceAvailability = data;
      this.updateSearchData();
    });
    this.commonService.isSingleDay$.subscribe((data)=>{
      this.isFetched = data;
      this.availabilityList = [];
      this.updateSearchData();
    });
  }
  updateSearchData(){
    if (this.isFetched && this.spaceAvailability?.data?.[0]?.spaces?.[0]?.av) {
      this.availabilityList = [this.spaceAvailability.data[0].spaces[0].av[0]];
    } else {
      this.availabilityList = this.spaceAvailability?.data?.[0]?.spaces?.[0]?.av || [];
      this.coverflowPosition = 1;
      this.initializeCoverflow();
    }
  }
  updateSearch() {
      this.commonService.setFetchDates(false);
      this.commonService.callSearchApi(true);
  }

}
