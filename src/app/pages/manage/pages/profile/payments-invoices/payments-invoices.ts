import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from 'src/app/services/invoice.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-payments-invoices',
  templateUrl: './payments-invoices.html',
  styleUrls: ['./payments-invoices.css']
})
export class PaymentsInvoicesComponent implements OnInit {
  page = 1;
  startDate = '';
  endDate='';
  currentTab = 'all';
  currentPage=1;
  selectedDateRange = { startDate:'',endDate:''};


  constructor(
    private transactionService: TransactionService,
    private invoiceService: InvoiceService,
    private toastr: ToastrService
  ){

  }
  ngOnInit(){
    if( this.startDate && this.endDate && this.currentPage === 1){
      this.getTransactionDetails();
    }
  }
  onSelectedDateRange(event: { startDate: string, endDate: string }) {
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    if( this.startDate && this.endDate && this.currentPage === 1){
      this.getTransactionDetails();
    }
  }
  checkCurrentTab(tab:number){
    this.currentPage = tab;
    if(this.currentPage === 1){
      this.getTransactionDetails();
    }
    else if(this.currentPage === 2){
      this.getInvoiceDetails();
    }
    else if(this.currentPage === 3){
      this.getPaymentMethodDetails();
    }
  }
  filterData(tab:string){
    this.currentTab = tab;
  }
  getTransactionDetails(){
    if(this.startDate && this.endDate && this.currentPage === 1){
    this.transactionService.retrievingTransactionDetails(this.startDate, this.endDate).subscribe(
      (response: any)=>{
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
  getInvoiceDetails(){
    if(this.currentPage === 2){
      this.invoiceService.retrievingInvoiceDetails().subscribe(
        (response: any)=>{
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
  getPaymentMethodDetails(){
    if(this.currentPage === 3){
      this.transactionService.retrievingPaymentMethods().subscribe(
        (response: any)=>{
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
}
