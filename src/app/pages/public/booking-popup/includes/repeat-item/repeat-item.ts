import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { AvailabilityListDTO } from 'src/app/models/booking';
import { BookingSpaceDTO } from 'src/app/models/search';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-repeat-item',
  templateUrl: './repeat-item.html',
  styleUrls: ['./repeat-item.css',  '../calendar-item/calendar-item.scss']
})
export class RepeatItemComponent implements AfterViewInit, OnInit {
  @ViewChild('coverflowContainer') coverflowContainer!: ElementRef;
  @ViewChild('prevArrow') prevArrow!: ElementRef;
  @ViewChild('nextArrow') nextArrow!: ElementRef;
  coverflowPosition = 0;
  coverflowImages: HTMLElement[] = [];
  checkAvailability!: boolean;
  spaceAvailability?: BookingSpaceDTO;
  selectAll = false;
  showScore!: boolean;
  timeRange: number[] = this.appConst.defaultTimeSpan;
  availabilityList: AvailabilityListDTO[] = [];
  constructor(
    private commonService: CommonService,
    private appConst: AppConst
  ) { }

  ngOnInit() {
    this.getBehaviorDetails();
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
      this.availabilityList = this.spaceAvailability?.data?.[0]?.spaces?.[0]?.av || [];
      console.log(this.availabilityList, 'this.availabilityList')
    });

    this.commonService.setShowScore$.subscribe((score) => {
      this.showScore = score;
    })

    console.log(this.spaceAvailability, '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
  }

  toggleSelection(val: boolean) {
    this.selectAll = val;
  }

  toggleScore() {
    this.showScore = !this.showScore;
    this.commonService.setShowScoreValue(this.showScore);
  }



}