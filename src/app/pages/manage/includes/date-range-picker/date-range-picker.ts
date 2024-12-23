import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import dayjs from 'dayjs';
import * as moment from 'moment';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.html',
  styleUrls: ['./date-range-picker.css']
})
export class DateRangePickerComponent implements OnInit {
  @Input() checkPage!: number;
  @Output() dateRange = new EventEmitter<{ startDate: string, endDate: string }>();
  selectedDateRange = {
    startDate: moment().subtract(29, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  };
  selected: any = {
    startDate: moment().subtract(29, 'days'),
    endDate: moment()
  };
  alwaysShowCalendars: boolean;
  ranges: any;
  minDate: any = null;
  maxDate: any = null;
  constructor() {
    this.alwaysShowCalendars = true;
  }
  ngOnInit(): void {
    if (this.checkPage == 1) {
      this.ranges = {
        'Today': [moment(), moment()],
        'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
        'Last Month': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()]
      };
      this.maxDate = dayjs();
    } else {
      this.ranges = {
        'Today': [moment(), moment()],
        'Next Week': [moment().add(7, 'days').startOf('isoWeek'), moment().add(7, 'days').endOf('isoWeek')],
        'Next Month': [moment().add(1, 'months').startOf('month'), moment().add(1, 'months').endOf('month')],
        'Next 30 Days': [moment(), moment().add(29, 'days')],
        'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
        'Last Month': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()]
      };
      this.maxDate = null;
    }
    this.dateRange.emit(this.selectedDateRange);
  }

  onRangeClicked(range: any) {
    if (range[0] && range[1]) {
      this.selectedDateRange = { startDate: range[0].format('YYYY-MM-DD'), endDate: range[1].format('YYYY-MM-DD') };
      this.dateRange.emit(this.selectedDateRange);
      console.log('Range clicked:', this.selectedDateRange);
    }
  }

  onDatesUpdated(event: any) {
    if (event.startDate && event.endDate) {
      this.selectedDateRange = { startDate: event.startDate.format('YYYY-MM-DD'), endDate: event.endDate.format('YYYY-MM-DD') };
      this.dateRange.emit(this.selectedDateRange);
      console.log('Dates updated:', this.selectedDateRange);
    }
  }
}
