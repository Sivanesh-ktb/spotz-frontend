import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-week-calendar-table',
  templateUrl: './week-calendar-table.html',
  styleUrls: ['./week-calendar-table.css',
    '.././org-calendar-filter.css'
  ]
})
export class WeekCalendarTableComponent {

  @Input() timeSlots: string[] = [];
  @Input() dateHeaders: Date[] = [];
  @Input() scheduleData:any;

  

isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
}
