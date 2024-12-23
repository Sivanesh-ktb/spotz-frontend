import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paid-booking',
  templateUrl: './paid-booking.html',
  styleUrls: ['./paid-booking.css']
})
export class PaidBookingComponent implements OnInit {

  @Input() paid:any;

  ngOnInit():void{
    console.log(this.paid);
  } 
}
