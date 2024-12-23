import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-transaction-fees',
  templateUrl: './transaction-fees.html',
  styleUrls: ['./transaction-fees.css']
})
export class TransactionFeesComponent {

  @Input() userFees!:boolean;
  @Output() userFeesValue = new EventEmitter<boolean>();
  isTransaction = false;
  saveTransaction(){
    this.userFeesValue.emit(this.userFees);
    this.isTransaction = false;
  }
  cancelTransaction(){
      this.userFees = this.isTransaction;
  }
  orgTransaction(){
    if(this.isTransaction){
        this.isTransaction = false;
    }
    else{
    this.isTransaction = true;
    }
  }
}
