import { Component, Input, OnInit } from '@angular/core';
import { Invoice } from 'src/app/models/deposits';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css']
})
export class InvoicesComponent implements OnInit {

  @Input() invoiced!:Invoice;

  ngOnInit():void{
    console.log(this.invoiced);
  }
}
