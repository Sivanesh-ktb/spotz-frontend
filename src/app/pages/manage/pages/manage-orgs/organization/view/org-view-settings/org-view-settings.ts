import { ViewportScroller } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Account } from 'src/app/models/org';
import { CreateOrgComponentService } from 'src/app/services/create-org.service';

@Component({
  selector: 'app-org-view-settings',
  templateUrl: './org-view-settings.html',
  styleUrls: ['./org-view-settings.css']
})
export class OrgViewSettingsComponent implements OnInit {
  @Input() orgId!: string;
  vm = {
    org: {
      legal: false,
      accts: [] as Account[],
    },
    salesTax: 0,
    leadTime: 0,
    tags: [] as string[],
  };

  constructor(
    private viewPortScroller: ViewportScroller,
    private router: Router,
    private createOrgService: CreateOrgComponentService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.orgId) {
      this.retrieveEditOrgDetails();
    }
  }

  viewOrgSettings(): void {
    if (this.orgId) {
      this.router.navigate([`/admin/manage/org/${this.orgId}/settings`]);
      this.viewPortScroller.scrollToPosition([0, 0]);
    }
  }

  retrieveEditOrgDetails(): void {
    this.createOrgService.retrieveOrgDetails(this.orgId).subscribe(
      (data: any) => {
        if (data.status === 200) {
          const responseBody = data.body; 
          this.vm = {
            org: {
              legal: responseBody.legal?.typ ? true : false,
              accts: responseBody.accts.length > 0 ? responseBody.accts : [],
            },
            salesTax: responseBody.salesTax || 0,
            leadTime: responseBody.leadTime || 0,
            tags: responseBody.tags || [],
          };
  
          console.log("Organization Details:", this.vm);
        } else {
          this.toastr.error(data.body?.message || 'Failed to fetch data.');
        }
      },
      (error) => {
        this.toastr.error('Failed to fetch organization details.');
        console.error(error);
      }
    );
  }
}
