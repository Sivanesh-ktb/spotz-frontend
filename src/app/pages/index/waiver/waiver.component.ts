import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waiver',
  templateUrl: './waiver.component.html',
  styleUrls: ['./waiver.component.css']
})
export class WaiverComponent implements OnInit {

  ngOnInit(){
    window.print();
  }

}
