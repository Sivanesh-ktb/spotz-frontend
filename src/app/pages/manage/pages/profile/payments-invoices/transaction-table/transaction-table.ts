import { Component } from '@angular/core';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.html',
  styleUrls: ['./transaction-table.css']
})
export class TransactionTableComponent {

  refunds='';

  refundView(selectedValue: string) {
    this.refunds = selectedValue;
  }

  clearFilter(){
    this.refunds = '';
  }
}
