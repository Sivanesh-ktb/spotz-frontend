import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-org-transactions',
  templateUrl: './org-transactions.html',
  styleUrls: ['./org-transactions.css']
})
export class OrgTransactionsComponent implements OnInit {

  page = 1;
  cardType = '';
  last4 = '';
  cardholderName='';
  orgId = '';
  startDate = '';
  endDate='';
  selectedDateRange = { startDate:'',endDate:''};
  showRestFilters = false;
  constructor(
    private transactionService : TransactionService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ){
  }

  ngOnInit() : void{
  this.route.paramMap.subscribe(params=>{
    this.orgId = params.get('orgId')??'';
  });
  }

  checkRestFilters(){
    if(this.cardType || this.last4 || this.cardholderName){
      this.showRestFilters = true;
    }
    else{
      this.showRestFilters = false;
    }
  }
  resetFilters(){
    this.cardType = '';
    this.last4 = '';
    this.cardholderName = '';
    this.retrievingTransactionsService();
    this.showRestFilters = false;
  }
  onSelectedDateRange(event: { startDate: string, endDate: string }) {
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    if(this.orgId && this.startDate && this.endDate){
      this.retrievingTransactionsService();
    }
  }
  searchTransactions(){
    this.retrievingTransactionsService();
  }
  retrievingTransactionsService(){
       this.transactionService.getTransactionsDetails(this.orgId,this.cardType,this.cardholderName,
        this.last4,this.startDate,this.endDate).subscribe(
        (response:any)=>{
          if(response.status == 200){
               console.log(response.body);
          }
          else{
            this.toastr.error(response.body.message);
          }
        }
       )
  }
}
