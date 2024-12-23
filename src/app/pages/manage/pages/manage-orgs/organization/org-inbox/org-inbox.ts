import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from 'src/app/services/booking.service';
import { HttpResponse } from '@angular/common/http';
import { StatusCode } from 'src/app/status-code';

@Component({
  selector: 'app-org-inbox',
  templateUrl: './org-inbox.html',
  styleUrls: ['./org-inbox.css']
})
export class OrgInboxComponent implements OnInit {

orgId='';
unreadExpanded = true;
readExpanded = true;
inboxData = [];
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private viewPortScroller: ViewportScroller,
    private bookingService: BookingService,
    private toastr: ToastrService,
  ){

  }
ngOnInit(){
  this.route.paramMap.subscribe(paramMap =>{
    this.orgId = paramMap.get('orgId')??'';
    if(this.orgId){
      this.getInbox();
    }
  })
}
viewUnread(){
  this.unreadExpanded = !this.unreadExpanded;
}
viewRead(){
  this.readExpanded = !this.readExpanded;
}
  viewSchedule(){
    this.router.navigate([`admin/manage/org/${this.orgId}/schedule`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
 getInbox(){
  this.bookingService.retrievingInboxDetails(this.orgId).subscribe(
    (response: HttpResponse<Object>)=>{
      if(response.status === StatusCode.SUCCESS){
        this.inboxData = response.body as [];
      }
      else{
        this.toastr.error('An error occurred. Please try again later.');
      }
    }
  )
 }
refreshInbox(){
this.getInbox();
}
}
