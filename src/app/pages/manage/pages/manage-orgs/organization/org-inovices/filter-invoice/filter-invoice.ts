import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-invoice',
  templateUrl: './filter-invoice.html',
  styleUrls: ['./filter-invoice.css']
})
export class FilterInvoiceComponent {

  allResult=false;
  paidResult=false;
  openResult=true;
  pastDueResult = false;

  allTab(){
    this.allResult=true;
    this.paidResult=false;
    this.openResult=false;
    this.pastDueResult = false;
  }
  paidTab(){
    this.allResult=false;
    this.paidResult=true;
    this.openResult=false;
    this.pastDueResult = false;
  }
  openTab(){
    this.allResult=false;
    this.paidResult=false;
    this.openResult=true;
    this.pastDueResult = false;
  }
  pastDueTab(){
    this.allResult=false;
    this.paidResult=false;
    this.openResult=false;
    this.pastDueResult = true;
  }
  onGroupSelected(groupInfo: string[]): void {
    console.log(groupInfo);
  }
}
