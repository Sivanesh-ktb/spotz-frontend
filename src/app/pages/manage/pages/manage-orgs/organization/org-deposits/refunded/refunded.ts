import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-refunded',
  templateUrl: './refunded.html',
  styleUrls: ['./refunded.css']
})
export class RefundedComponent implements OnInit {

  @Input() refunded:any;

  ngOnInit():void{
    console.log(this.refunded);
  }
}
