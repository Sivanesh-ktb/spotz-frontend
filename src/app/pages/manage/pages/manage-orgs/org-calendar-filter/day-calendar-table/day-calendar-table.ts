import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-day-calendar-table',
  templateUrl: './day-calendar-table.html',
  styleUrls: ['./day-calendar-table.css', '.././org-calendar-filter.css'],
})
export class DayCalendarTableComponent {
  @Input() timeSlots: string[] = [];
  @Input() spaceDetails: any[] = [];

  isToday(time: string): boolean {
    const today = new Date();
    const formattedTime = today.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return time === formattedTime;
  }
}
