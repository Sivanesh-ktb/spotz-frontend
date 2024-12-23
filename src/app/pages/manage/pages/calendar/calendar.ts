import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
})
export class CalendarComponent implements OnInit {
  @Input() viewMode?: string;
  @Input() date!: string;

  month = '';
  year = 0;
  day = 0;
  dayName = '';
  formattedStartDate = '';
  formattedEndDate = '';

  ngOnInit() {
    if (this.date) {
      const dateObj = new Date(this.date);
      this.dayName = dateObj.toLocaleString('en-US', { weekday: 'short' });
      this.month = dateObj.toLocaleString('en-US', { month: 'short' });
      this.day = dateObj.getDate();
      this.year = dateObj.getFullYear();
      if (this.viewMode === 'grid') {
        this.formattedStartDate = `${this.month} ${this.day}`;
        this.formattedEndDate = `${this.month} ${this.day}`;
      }
    }
  }
}
