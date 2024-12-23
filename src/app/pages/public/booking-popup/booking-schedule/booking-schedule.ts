import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { BookingSpaceDTO } from 'src/app/models/search';
import { RecurringFilterParams } from 'src/app/models/space';
import { CommonService } from 'src/app/services/common.service';
import { checkToday } from 'src/app/utils/utils';

@Component({
  selector: 'app-booking-schedule',
  templateUrl: './booking-schedule.html',
  styleUrls: ['./booking-schedule.css']
})
export class BookingScheduleComponent implements OnInit {
  @Output() navigateToSchedule = new EventEmitter<void>();
  @Input() filterparams!: RecurringFilterParams;
  spaceAvailabilityDetails!: BookingSpaceDTO;
  checkAvailability = false;
  listing: any = {};
  filter: RecurringFilterParams = {};
  currentTime = 0;
  showScore = false;
  savedSettings: any;
  level = 0;
  timeRange = this.appConst.defaultTimeSpan;

  constructor(
    private commonService: CommonService,
    private appConst: AppConst
  ) {

  }
  onNavigateToUpdateSchedule() {
    this.navigateToSchedule.emit();
  }
  ngOnInit() {
    this.initializeComponent();
    this.getBehaviorDetails();
  }

  initializeComponent(): void {
    this.listing.cart = 0;
    this.showScore = false;
    this.commonService.setShowScoreValue(this.showScore);

    this.currentTime = checkToday(this.listing.date);

    this.filter = this.filterparams;

    if (this.listing.purchasepath) {
      this.filter.searchDate = this.filterparams.searchDate;
    }
  }

  getBehaviorDetails() {
    this.commonService.setAvailability$.subscribe((data) => {
      this.checkAvailability = data;
    });

    this.commonService.setShowScore$.subscribe((score) => {
      this.showScore = score;
    })
  }

  toggleScore() {
    this.showScore = !this.showScore;
    this.commonService.setShowScoreValue(this.showScore);
  }
}
