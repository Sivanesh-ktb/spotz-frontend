import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-spotz-service-fee',
  templateUrl: './spotz-service-fee.html',
  styleUrls: ['./spotz-service-fee.css']
})
export class SpotzServiceFeeComponent {

  @Input() spotzFees!:boolean;
  @Output() spotzFeesValue = new EventEmitter<boolean>();
  isFees= false;

  orgSpotzFees(){
    if(this.isFees){
        this.isFees = false;
    }
    else{
        this.isFees = true;
    }
  }
  saveSpotzFees(){
    this.spotzFeesValue.emit(this.spotzFees);
    this.isFees = false;
  }
  cancelSpotzFees(){
    this.spotzFees= false;

  }
}
