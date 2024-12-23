import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-unauthorized-popup',
  templateUrl: './unauthorized-popup.html',
  styleUrls: ['./unauthorized-popup.css']
})
export class UnauthorizedPopupComponent {

  constructor(
    private dialogRef: MatDialogRef<UnauthorizedPopupComponent>
  ) { }

  dismissPopup(){
    this.dialogRef.close();
  }
}
