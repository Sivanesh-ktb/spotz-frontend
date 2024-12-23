import { ViewportScroller } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fac-events',
  templateUrl: './fac-events.html',
  styleUrls: ['./fac-events.css']
})
export class FacEventsComponent implements OnInit {
  @Input () bookingData!:any;
 orgId = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ){

  }
  ngOnInit(): void{
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
    });
    console.log('bookingData');
    console.log(this.bookingData);
  }
  viewEventDetails(){
    this.router.navigate([`admin/manage/org/${this.orgId}/schedule`]);
    return this.viewportScroller.scrollToPosition([0,0]);
  }

}
