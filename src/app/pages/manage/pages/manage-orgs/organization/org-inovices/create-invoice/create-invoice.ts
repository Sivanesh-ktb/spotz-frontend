import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvoiceDTO } from 'src/app/models/org';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.html',
  styleUrls: ['./create-invoice.css']
})
export class CreateInvoiceComponent implements OnInit {

  groupId = '';
  groupName = '';
  orgId= '';
  invoiced= true;
  discounted=false;
  startDate = '';
  endDate = '';
  pending !:InvoiceDTO;
  status = false;
  invoiceCount = this.pending?.nonGroup?.length || 0;
  groupCount = this.pending?.group?.length || 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewPortScroller : ViewportScroller,
    private invoiceService : InvoiceService,
    private toastr: ToastrService

  ){

  }

  ngOnInit(): void{
    this.route.paramMap.subscribe(params=>{
      this.orgId = params.get('orgId')??'';
    })
  }
  invoicedTab(){
    this.invoiced=true;
    this.discounted=false;
  }
  discountedTab(){
    this.discounted=true;
    this.invoiced = false;
  }
  onGroupSelected(groupInfo: string[]): void {
    this.groupId = groupInfo[0];
    this.groupName = groupInfo[1];
  }
  searchGroupReport(){
    this.router.navigate([`admin/manage/org/${this.orgId}/groups/${this.groupId}`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  OnDateRangeFilterData(event: { startDate: string, endDate: string }) {
    console.log(event.startDate);
    console.log(event.endDate);
    this.startDate = event.startDate;
    this.endDate = event.endDate;
  }
  searchDateRange(){
   this.getOrgPendingInvoices();
   this.orgGroupReport();
  }

  getOrgPendingInvoices(){
    this.invoiceService.getPendingInvoices(this.orgId,this.startDate,this.endDate).subscribe(
      (response:any)=>{
        if(response.status === 200){
          this.pending = response.body;
          this.status = true;
        }
        else{
          this.toastr.error(response.body.message);
        }
      }
     )
  }
  orgGroupReport(){
    this.invoiceService.getOrgGroupReport(this.orgId,this.startDate,this.endDate).subscribe(
      (response:any)=>{
        if(response.status === 200){
          console.log(response.body);
        }
        else{
          this.toastr.error(response.body.message);
        }
      }
    )
  }
}
