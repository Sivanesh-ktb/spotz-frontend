import { Component, EventEmitter, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-attendance-drop-down',
  templateUrl: './attendance-drop-down.html',
  styleUrls: ['./attendance-drop-down.css']
})
export class AttendanceDropDownComponent {

  attendanceEnum = this.appConst.ATTENDANCE_ENUM;
  accessLevel = 0;
  selectedName = '';

  // Define the output event emitter to emit an object
  @Output() attendanceSelected = new EventEmitter<{ id: number, name: string }>();

  constructor(private appConst: AppConst) {}

  selectFacility(id: number, index: number, name: string): void {
    this.accessLevel = index + 1;
    this.selectedName = name;

    // Emit an object with both id and name
    this.attendanceSelected.emit({ id, name });
  }

  isChecked(index: number): boolean {
    return this.accessLevel === index + 1;
  }
  clearAllAttendance(): void {
    this.selectedName = '';
    this.accessLevel = 0;
    this.attendanceSelected.emit({ id: 0, name: '' });
  }
}
