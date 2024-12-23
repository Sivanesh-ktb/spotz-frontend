import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sales-tax',
  templateUrl: './sales-tax.html',
  styleUrls: ['./sales-tax.css',
    '../basics-setting.css'
  ]
})
export class SalesTaxComponent {

  saleTax= false;
  @Input() salesTax!:number;
  @Output() salesTaxValue = new EventEmitter<number>();
  taxExemptNumber='';
  salesTaxInfo(){
    this.saleTax = true;
  }
  saveTaxInfo(){
    this.salesTaxValue.emit(this.salesTax);
    this.saleTax = false;
  }
  editTaxInfo(){
    this.saleTax = false;
  }
}
