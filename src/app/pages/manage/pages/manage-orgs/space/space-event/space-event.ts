import { ViewportScroller } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-space-event',
  templateUrl: './space-event.html',
  styleUrls: ['./space-event.css']
})
export class SpaceEventComponent implements OnInit {
  @Input () bookingData!:any;
 orgId = '';
 facId = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ){

  }
  ngOnInit(): void{
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.facId = paramMap.get('facilityId') ?? '';
    });
    console.log('bookingData');
    console.log(this.bookingData);
  }
  viewEventDetails(){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/reservations`]);
    return this.viewportScroller.scrollToPosition([0,0]);
  }
}
