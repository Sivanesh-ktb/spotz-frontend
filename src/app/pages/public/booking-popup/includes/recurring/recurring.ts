import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConst } from 'src/app/app.const';
import { Filter } from 'src/app/models/space';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.html',
  styleUrls: ['./recurring.css']
})
export class RecurringComponent implements OnInit {
  selectedDate!: Date | null | string | undefined;
  filter !:Filter;
  days: string[] = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
  narrow = false;
  spaceType = false;
  minDate: Date = new Date();
  date = "";
  isRecurring = false;
  filterType: number = this.appConst.monthFilterType;
  dayOfWeek!: number;
  selected=0;
  @Input() updateSearch!: boolean;
  private subscriptions: Subscription = new Subscription();
  constructor(
       private commonService: CommonService,
       private appConst: AppConst,
  ){

  }
  ngOnInit() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 28);
    this.date = currentDate.toISOString().split('T')[0];
    const existingFilter = this.commonService.getFilterValues();
    if (existingFilter) {
      this.filter = existingFilter;
    } else {
      this.filterType = this.appConst.monthFilterType;
      this.setFilterDay();
    }
  if(this.filter?.repeat?.rules?.type == this.appConst.weekFilterType){
    this.commonService.eventDate$.subscribe(date => {
      this.selectedDate = date;
      if (this.selectedDate) {
        this.filterType = this.appConst.weekFilterType;
        const dateObj = new Date(this.selectedDate);
        const dayIndex = dateObj.getDay();
        this.dayOfWeek = (dayIndex + 6) % 7;
        const checkedDays = this.filter?.repeat?.rules?.day.filter(d => d.checked).length;
        if (checkedDays === 1 || checkedDays === 0) {
          this.setFilterDay();
          this.filter.repeat.rules.day[this.dayOfWeek].checked = true;
        }
      }
    });
  }
  this.subscriptions.add(
    this.commonService.recurringSource$.subscribe((recurring) => {
      this.isRecurring = recurring;
    })
  );
  }

  setFilterDay() {
    this.filter = {
      repeat: {
        active: true,
        rules: {
          type: this.filterType,
          date: {
            selected: this.selected,
          },
          day: this.days.map((_, index) => ({
            checked: this.filter?.repeat?.rules?.day[index]?.checked ?? false
          })),
          end: {
            rule: 0,
            data: [this.appConst.defaultMonth,
              this.date,
            ]
          },
          dayString: () => {
            return this.filter.repeat.rules.day
              .map((rule, index) => (rule.checked ? this.days[index] : null))
              .filter(day => day !== null);
          }
        }
      },
    };
    this.commonService.setFilterValues(this.filter);
  }
  changeEnd(){
    this.setFilterDay();
  }
  typeFilter() {
    this.commonService.setFilterValues(this.filter);
    this.ngOnInit();
  }
}
