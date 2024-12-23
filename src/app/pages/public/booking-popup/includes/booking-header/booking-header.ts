import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-header',
  templateUrl: './booking-header.html',
  styleUrls: ['./booking-header.css']
})
export class BookingHeaderComponent {

  @Input() facName!: string;
  @Input() orgName!: string;
  @Input() banner!: string;
  constructor(
    private dialog : MatDialog

  ){

  }
  dismiss(){
    this.dialog.closeAll();
  }
}
