import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateOrgComponentService } from 'src/app/services/create-org.service';

@Component({
  selector: 'app-payout-methods',
  templateUrl: './payout-methods.html',
  styleUrls: ['./payout-methods.css',
    '../basics-setting.css'
  ]
})
export class PayoutMethodsComponent implements OnInit{
  @Input() accts!:any;
  @Output() acctsChanges = new EventEmitter<any>();
  showPayoutMethod=false;
  routing!: number;
  account!:string;
  accountConfirm!:string;
  validate = true;
  routingStatus !:number;
  routingNumberStatusMessage!:string;
  accountNumberStatusMessage!:string;
  customerName='';
  constructor(
    private createOrgService: CreateOrgComponentService,
  ){

  }
  ngOnInit(){
    this.account = this.accts?.[0]?.account;
    this.routing = this.accts?.[0]?.routing;
    this.customerName = this.accts?.[0]?.name;
    this.accountConfirm = this.account;
    if(this.accts && this.accts.length > 0){
      this.validate = false;
    }
  }
  paymentMethodInfo(){
    this.showPayoutMethod = true;
  }
  savePayment(){
    this.accts = {
      account: this.account,
      apply:true,
      last4: '***'+this.account.slice(-4),
      name: this.customerName,
      routing: this.routing
    }
    this.acctsChanges.emit(this.accts);
    this.showPayoutMethod = false;
  }
  cancelPayment(){
    this.showPayoutMethod = false;
  }
  checkRoutingNumberDetails(){
    this.createOrgService.checkRoutingNumber(this.routing).subscribe(
      (response : any) => {
        if(response.status === 200){
          this.routingStatus = response.body.code;
          if(this.routingStatus == 200){
             this.validate = false;
             this.validateForm();
             this.customerName = response.body.customer_name;
          }
          else{
            this.validate = true;
          }
          this.routingNumberStatusMessage = response.body.message;
        }
      }
    )
  }
  validateForm(){
    this.validate = true;
    if (this.account && this.accountConfirm && (this.account === this.accountConfirm)) {
      if (this.routingStatus !== 200) {
        this.checkRoutingNumberDetails();
      }
      this.accountNumberStatusMessage = "";
      this.validate = false;
    } else {
      if(this.accountConfirm){
        this.accountNumberStatusMessage = "Account numbers do not match.";
        this.validate = true;
      }
    }
  }
}
