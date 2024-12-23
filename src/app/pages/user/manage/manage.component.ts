import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { retrievingOrgDetailsService } from 'src/app/services/retrieving-org.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  date = '';
  orgDetails: any[] = [];
  constructor(
    private retrievingOrgDetailsService: retrievingOrgDetailsService,
    private toastr: ToastrService,
    private router: Router,
    private viewPortScroller: ViewportScroller,
    private commonService: CommonService
  ){
    const initialDate = new Date();
    initialDate.setDate(initialDate.getDate() + 3);
    this.date = initialDate.toISOString().split('T')[0];
  }
  ngOnInit(): void {
    this.retrievingOrgDetails();
  }

  retrievingOrgDetails() {
    this.retrievingOrgDetailsService.retrieveAllOrgDetails(this.date).subscribe(
      (response: any) => {
        if(response.status === 200){
          this.orgDetails = response?.body?.organizations;
          console.log('response', this.orgDetails);
          this.commonService.userOrganizationsDetails(this.orgDetails);
        } else {
          this.toastr.error(response?.message || 'Unable to retrieve organizations');
        }
      },
      (error) => {
        this.toastr.error(error.message);
      }
    );
  }
  viewPage(orgId:string,orgName:string,page=''){
    if(orgId && page){
    this.router.navigate([`/admin/manage/org/${orgId}/${page}`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
    else{
      this.router.navigate([`/admin/manage/org/${orgId}`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
}
