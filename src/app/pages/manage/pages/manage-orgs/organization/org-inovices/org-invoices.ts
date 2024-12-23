import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-org-invoices',
  templateUrl: './org-invoices.html',
  styleUrls: ['./org-invoices.css']
})
export class OrgInvoicesComponent implements OnInit {
  orgId='';
  constructor(
    private route:ActivatedRoute,
    private invoiceService : InvoiceService
  ){

  }
  ngOnInit():void{
    this.route.paramMap.subscribe(params=>{
      this.orgId = params.get('orgId')??'';
      if(this.orgId){
        this.getOrgInvoices();
      }
    })
  }
  getOrgInvoices(){
    this.invoiceService.retrievingOrgInvoices(this.orgId).subscribe(
      (response:any)=>{
        if(response.status === 200){
          console.log(response.body);
        }
      })
  }
}
