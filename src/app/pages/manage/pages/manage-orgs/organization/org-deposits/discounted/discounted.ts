import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-deposits-discounted',
  templateUrl: './discounted.html',
  styleUrls: ['./discounted.css']
})
export class DiscountedDepositsComponent implements OnInit {

  @Input() discounted:any;

  ngOnInit() : void{
    console.log(this.discounted);
  }
}
