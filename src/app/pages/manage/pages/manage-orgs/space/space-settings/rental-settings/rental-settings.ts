
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { SpaceData } from "src/app/models/space";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-rental-settings',
  templateUrl:'./rental-settings.html',
  styleUrls:['./rental-settings.css',
    '../space-settings.css'
  ]
})

export class RentalSettingsComponent {
  @Input() spaceDetails!: SpaceData;
  @Input() spaceId!: string;
  @Input() rentalBlockTime!: string;
  @Input() selectedOptionValue!: number;
  @Input() hideRental  = true;
  @Output() selectedOption = new EventEmitter<number>();
  rentalType = '';
  rentalAmount = '';
  showBuffer = false;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if ((target.closest('.cancel-addons')
      || target.closest('.cancel-buffer')
     || target.closest('.cancel-time-block'))) {
      this.hideRental = true;
    }
  }
  constructor(
    private appConst: AppConst,
    private dialog : MatDialog,
  ) {

  }
  changeRental() {
    this.hideRental = false;
  }
  cancelRental() {
    this.hideRental = true;
  }
  confirmRentalTime() {
    const dialogRef =this.dialog.open(ConfirmationPopupComponent,{
      width:'400px',
      position:{top:'20px'},
      data:{
        rental:this.selectedOptionValue,
        spaceDetails:this.spaceDetails,
        type:this.appConst.RENTALSETTINGCONFIRMATION
      }
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result?.status === this.appConst.RENTALSETTINGCONFIRMATION){
        this.selectedOption.emit(this.selectedOptionValue);
        this.hideRental = true;
      }

    })

  }
}

