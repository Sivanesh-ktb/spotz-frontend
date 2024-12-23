import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

  @Output() selectedMonth = new EventEmitter<any>();
  months: string[] = this.appConst.selectDropDownMonth;
  startYear = this.appConst.startedYear;

  years: number[] = [];
  monthYearOptions: { year: number, months: string[] }[] = [];

  selectedMonthYear = '';

  constructor(
    private appConst : AppConst
  ) {
    const currentYear = new Date().getFullYear();
    for(let year = this.startYear; year <= currentYear + 1; year++) {
      this.years.push(year);
    }
    this.years.reverse();
    this.populateMonthYearOptions();
  }

  populateMonthYearOptions(): void {
    this.monthYearOptions = this.years.map(year => ({
      year: year,
      months: this.months.map(month => `${year} ${month}`)
    }));
  }

  ngOnInit(): void {
    this.setCurrentMonthYear();
  }

  setCurrentMonthYear(): void {
    const now = new Date();
    const currentMonth = this.months[now.getMonth()];
    const currentYear = now.getFullYear();
    this.selectedMonthYear = `${currentYear} ${currentMonth}`;
  }
  selectDayDropDown(event:any): void {
    const selectedMonthYear = event.target.value;
    this.selectedMonth.emit(selectedMonthYear);
  }
}
