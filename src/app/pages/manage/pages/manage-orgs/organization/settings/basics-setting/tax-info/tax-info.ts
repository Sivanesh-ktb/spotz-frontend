import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-tax-info',
  templateUrl: './tax-info.html',
  styleUrls: ['./tax-info.css',
    '../basics-setting.css'
  ]
})
export class TaxInfoComponent implements OnInit {
  @Input() legal: any;
  @Output() legalChanges = new EventEmitter<any>();
  taxTypes = this.appConst.taxTypes;
  type =false;
  typ = '';
  name = '';
  taxId = '';
  other = '';
  valid = true;
  constructor(
    private appConst : AppConst
  ){}

  ngOnInit(){
    this.typ = this.legal?.typ;
    this.name = this.legal?.name;
    this.taxId = this.legal?.taxId;
    this.other = this.legal?.other;

  }
  editInformation(){
    this.type = true;
  }
  editLegal(){
    this.type = false;
  }
  validateForm(){
    if(this.typ === 'Other' && this.other){
      this.valid = false;
    }
    else if(this.typ || this.name || this.taxId){
         this.valid = true;
       }
    else  {
      this.valid = false;
    }
  }
  saveInformation(){
    this.legal = {
      typ: this.typ,
      apply:true,
      name: this.name,
      taxId: this.taxId,
      other: this.other,
      last4: '***'+this.taxId.slice(-4)
    }
    this.type = false;
    this.legalChanges.emit(this.legal);
  }
}

