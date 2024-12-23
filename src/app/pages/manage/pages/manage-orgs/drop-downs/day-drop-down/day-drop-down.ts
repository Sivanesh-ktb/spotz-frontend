import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { timeBlock } from 'src/app/models/facility';

@Component({
  selector: 'app-day-drop-down',
  templateUrl: './day-drop-down.html',
  styleUrls: ['./day-drop-down.css']
})
export class DayDropDownComponent {
  timeBlock: timeBlock[] = [];
  allSelected = false;
  @Input() selectedDays: string[] = [];
  @Input() isDisabled !: boolean;
  days: string[] = this.appConst.allDays;
  weekdaysSelected = false;
  weekendsSelected = false;
  dropdownOpen = false;
  @Output() daySelected = new EventEmitter<string[]>();
  @Output() selectedTimeBlockDay = new EventEmitter<{ selectedDays: string[] }>();
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-menu') && !target.closest('.form-control')) {
      this.dropdownOpen = false;
    }
  }
  constructor(private appConst: AppConst) { }

  toggleAllDays(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.selectedDays = [...this.days];
      this.weekdaysSelected = true;
      this.weekendsSelected = true;
    } else {
      this.selectedDays = [];
      this.weekdaysSelected = false;
      this.weekendsSelected = false;
    }
    this.updateTimeBlocks();
    this.emitSelectedDays();
  }
  toggleWeekdays(): void {
    this.weekdaysSelected = !this.weekdaysSelected;
    if (this.weekdaysSelected) {
      this.selectedDays = this.selectedDays.concat(this.appConst.weekDays);
      this.selectedDays = [...new Set(this.selectedDays)];
    } else {
      this.selectedDays = this.selectedDays.filter(day => !this.appConst.weekDays.includes(day));
    }
    this.updateAllSelected();
    this.updateTimeBlocks();
    this.emitSelectedDays();
  }
  toggleWeekends(): void {
    this.weekendsSelected = !this.weekendsSelected;
    if (this.weekendsSelected) {
      this.selectedDays = this.selectedDays.concat(this.appConst.weekEnds);
      this.selectedDays = [...new Set(this.selectedDays)];
    } else {
      this.selectedDays = this.selectedDays.filter(day => !this.appConst.weekEnds.includes(day));
    }
    this.updateAllSelected();
    this.updateTimeBlocks();
    this.emitSelectedDays();
  }
  updateAllSelected(): void {
    this.allSelected = this.selectedDays.length === this.days.length;
    this.weekdaysSelected = this.appConst.weekDays.every(day => this.selectedDays.includes(day));
    this.weekendsSelected = this.appConst.weekEnds.every(day => this.selectedDays.includes(day));
  }
  updateTimeBlocks(): void {
    this.timeBlock.forEach(block => {
      block.selectedDays = [...this.selectedDays];
    });
  }
  toggleDay(day: string): void {
    const index = this.selectedDays.indexOf(day);
    if (index >= 0) {
      this.selectedDays.splice(index, 1);
    } else {
      this.selectedDays.push(day);
    }
    this.updateAllSelected();
    this.updateTimeBlocks();
    this.emitSelectedDays();
  }
  getFirstLetters(): string {
    return this.selectedDays.map(day => day[0]).join('-');
  }
  private emitSelectedDays(): void {
    this.daySelected.emit(this.selectedDays);
    this.selectedTimeBlockDay.emit({ selectedDays: this.selectedDays });
  }
  clearAllDays(): void {
    this.selectedDays = [];
    this.updateAllSelected();
    this.updateTimeBlocks();
    this.emitSelectedDays();
  }
}
