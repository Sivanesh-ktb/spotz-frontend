import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-terms-of-rental',
  templateUrl: './terms-of-rental.html',
  styleUrls: ['./terms-of-rental.css']
})
export class TermsOfRentalComponent {
  checkHeader = true;

  constructor(
   public dialogRef: MatDialogRef<TermsOfRentalComponent>
  ){

  }
  dismiss(){
    this.dialogRef.close();
  }
}
