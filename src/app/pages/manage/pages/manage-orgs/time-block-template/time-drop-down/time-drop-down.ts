import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-time-drop-down',
  templateUrl: './time-drop-down.html',
  styleUrls: ['./time-drop-down.css']
})
export class TimeDropDownComponent implements OnInit {
  @Input() page!: number;
  @Output() timeSelected = new EventEmitter<{ startTime: string, endTime: string }>();
  @Input() selectedEndTime!: string;
  @Input() selectedStartTime !:string;
  startTime = '';
  endTime = '';
  times: string[] = [];
  validationError = '';
  constructor(
    private commonService: CommonService
  ){

  }
  ngOnInit() {
    this.generateTimes();
    this.startTime = this.selectedStartTime;
    this.endTime = this.selectedEndTime
  }

  generateTimes(): void {
    const period = ['AM', 'PM'];
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 5) {
        const hour = hours % 12 === 0 ? 12 : hours % 12;
        const minute = minutes < 10 ? '0' + minutes : minutes;
        const time = `${hour}:${minute} ${period[Math.floor(hours / 12)]}`;
        this.times.push(time);
      }
    }
  }
  selectStartTime(time: string): void {
    this.startTime = time;
    this.validateTimes();
  }
  selectEndTime(time: string): void {
    this.endTime = time;
    this.validateTimes();
  }
  validateTimes(): void {
    if (this.startTime && this.endTime) {
      const startMinutes = this.commonService.convertTo24HourFormat(this.startTime);
      const endMinutes = this.commonService.convertTo24HourFormat(this.endTime);
      if (startMinutes >= endMinutes) {
        this.validationError = 'End time must be later than start time.';
      } else {
        this.validationError = '';
        this.emitTimes();
      }
    }
  }
  emitTimes(): void {
    if (!this.validationError) {
      this.timeSelected.emit({ startTime: this.startTime, endTime: this.endTime });
    }
  }
}
