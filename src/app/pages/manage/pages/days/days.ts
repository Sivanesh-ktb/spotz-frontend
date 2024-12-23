import { Component, Input } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-days',
  templateUrl: './days.html',
  styleUrls: ['./days.css'],
})
export class DaysComponent {
  days = this.appConst.days;
  @Input() selectedDays!: string[];
  @Input() viewMode?:string;

  constructor(private appConst: AppConst) {}
  isSelectedDay(day: string): boolean {
    return this.selectedDays.includes(day);
  }
}
