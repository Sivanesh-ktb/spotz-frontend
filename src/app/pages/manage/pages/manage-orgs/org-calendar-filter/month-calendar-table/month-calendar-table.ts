import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-month-calendar-table',
  templateUrl: './month-calendar-table.html',
  styleUrls: ['./month-calendar-table.css',
    '.././org-calendar-filter.css'
  ]
})
export class MonthCalendarTableComponent {
@Input() daysInMonth: (number | null)[] = [];

isToday(day: number | null): boolean {
  if (!day) return false;
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const dateToCheck = new Date(currentYear, currentMonth, day);
  return dateToCheck.getDate() === currentDay && dateToCheck.getMonth() === currentMonth;
}
}
