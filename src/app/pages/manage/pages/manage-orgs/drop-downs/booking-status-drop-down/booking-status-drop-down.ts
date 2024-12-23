import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-booking-status-drop-down',
  templateUrl: './booking-status-drop-down.html',
  styleUrls: ['./booking-status-drop-down.css']
})
export class BookingStatusDropDownComponent implements OnChanges, OnInit {
  @Input() setStatus !: number;
  @Input() clearValue !: boolean;
  bookingStatus: { title: string, value: number }[] = this.appConst.BOOKING_STATUS;
  dropdownOpen = false;
  selectedStatusNames: string[] = [];
  selectedStatusValues: number[] = [];
  defaultSelectedValue = [1,2];
  defaultSelectedName = ['Pending','Approved'];
  @Output() bookingTypeSelected = new EventEmitter<number[]>();
  @Output() bookingTypeNameSelected = new EventEmitter<{name:string[],value:number[]}>();
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-menu') && !target.closest('.form-control')) {
      this.dropdownOpen = false;
    }
  }
  constructor(
    private appConst: AppConst
  ) { }

  ngOnInit(): void {
    if(this.setStatus === 1){
      this.setDefaultValues();
    }
   }
   ngOnChanges() {
    if (this.clearValue) {
      this.selectedStatusValues = [];
      this.selectedStatusNames = [];
      if(this.setStatus === 1){
      this.setDefaultValues();
      }
    }
  }
  setDefaultValues(){
      this.selectedStatusValues.splice(this.defaultSelectedValue.length, 0, ...this.defaultSelectedValue);
      this.selectedStatusNames.splice(this.defaultSelectedName.length, 0, ...this.defaultSelectedName);
      this.bookingTypeNameSelected.emit({
        name: this.defaultSelectedName,
        value: this.defaultSelectedValue
      });
  }
  toggleBookingType(value: number, index: number, title: string): void {
    const selectedIndex = this.selectedStatusValues.indexOf(value);
    if (selectedIndex > -1) {
      // Deselect
      this.selectedStatusValues.splice(selectedIndex, 1);
      this.selectedStatusNames.splice(selectedIndex, 1);
        this.bookingTypeNameSelected.emit({
          name: this.selectedStatusNames,
          value: this.selectedStatusValues
        });
      this.bookingTypeSelected.emit(this.selectedStatusValues);
    } else {
      // Select
      this.selectedStatusValues.push(value);
      this.selectedStatusNames.push(title);
      this.bookingTypeNameSelected.emit({
        name: this.selectedStatusNames,
        value: this.selectedStatusValues
      });
      this.bookingTypeSelected.emit(this.selectedStatusValues);
    }
  }

  isChecked(value: number): boolean {
    return this.selectedStatusValues.includes(value);
  }
  clearAllStatuses(): void {
    this.selectedStatusValues = [];
    this.selectedStatusNames = [];
    this.bookingTypeNameSelected.emit({
      name: this.selectedStatusNames,
      value: this.selectedStatusValues
    });
    this.bookingTypeSelected.emit(this.selectedStatusValues);
  }
}
