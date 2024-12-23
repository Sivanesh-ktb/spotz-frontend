import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Invoice } from 'src/app/models/deposits';
import { DepositsService } from 'src/app/services/deposits.service';

@Component({
  selector: 'app-org-deposits',
  templateUrl: './org-deposits.html',
  styleUrls: ['./org-deposits.css']
})
export class OrgDepositsComponent implements OnInit {
  discounted : any;
  invoiced !: Invoice;
  offline: any;
  refunded:any;
  paid:any;
  showDepositPanel  = false;
  orgId  = '';
  startDate: string =moment().subtract(29, 'days').format('YYYY-MM-DD');
  endDate:string = moment().format('YYYY-MM-DD');
  constructor(
    private depositsService : DepositsService,
    private route: ActivatedRoute,
    private toastr:ToastrService
  ){

  }
  ngOnInit() : void{
    this.route.paramMap.subscribe(params=>{
      this.orgId = params.get('orgId')??'';
      this.retrievingOrgDepositsDetails();
    })
  }
  toggleDeposits(){
    this.showDepositPanel = !this.showDepositPanel;
  }
 retrievingOrgDepositsDetails(){
  this.depositsService.getOrgDepositsDetails(this.orgId,this.startDate,this.endDate).subscribe(
    (response: any)=>{
      if(response.status === 200){
        const data = response?.body?.reports;
        this.discounted =data?.discounted;
        this.invoiced = data.invoiced;
        this.offline = data?.offline;
        this.refunded = data?.refunded;
        this.paid = data?.paid;
      }
      else{
        this.toastr.error(response.body.message)
      }
    },
    (error)=>{
      console.log(error);
      this.toastr.error(error.error.message)
    }
  )
  }
}
