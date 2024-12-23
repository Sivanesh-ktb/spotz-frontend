import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';
import { retrievingOrgDetailsService } from "src/app/services/retrieving-org.service";
import { loginRoutes } from "src/app/models/enums";
import { ViewportScroller } from "@angular/common";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboardComponent implements OnInit {
  page = 1;
  pageSize = 10;
  orgDetails: any[] = [];
  pagedOrgDetails: any[] = [];
  orgId = '';
  totalItems = 0;
  isSorted = false;

  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private authService: AuthService,
    private retrievingOrgDetailsService: retrievingOrgDetailsService,
    private router: Router,
    private viewPortScroller: ViewportScroller,
    private toastr: ToastrService
  ) {this.pagedOrgDetails = []; }

  ngOnInit(): void {
    this.retrievingOrgDetails();
  }

  retrievingOrgDetails(date='') {
    this.retrievingOrgDetailsService.retrieveAllOrgDetails(date).subscribe(
      (response: any) => {
        if(response.status === 200){
        this.orgDetails = response?.body?.organizations;
        this.totalItems = response?.body?.organizations.length;
          this.sortData();
        } else {
          this.toastr.error(response?.message || 'Unable to retrieve organizations');
        }
      },
      (error) => {
        if(error.status === 401){
          this.authService.authLogout();
          this.router.navigate([loginRoutes.LOGIN]);
        }
        else{
          this.toastr.error(error.message);
        }

      }
    );
  }

  sort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
      this.isSorted = true;
    }
    this.sortData();
  }

  sortData() {
    this.pagedOrgDetails.sort((a, b) => {
      const fieldA = a[this.sortField];
      const fieldB = b[this.sortField];

      if (this.sortDirection === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
  }

  handlePagedOrgDetails(pagedData: any[]): void {
    this.pagedOrgDetails = pagedData;
  }

  getId(id: string) {
    this.orgId = id;
    this.router.navigate([`/admin/manage/org/${this.orgId}`]);
  }

  editOrganization(id: string) {
    this.router.navigate([`/admin/orgs/edit/${id}`]);
  }
  viewOrgInbox(id: string) {
    this.router.navigate([`/admin/manage/org/${id}/inbox`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewSetting(id: string) {
    this.router.navigate([`/admin/manage/org/${id}/settings`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewOrgGroup(id: string) {
    this.router.navigate([`/admin/manage/org/${id}/groups`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewFacility(id: string) {
    this.router.navigate([`/admin/manage/org/${id}/facs`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewEventList(id: string) {
    this.router.navigate([`/admin/manage/org/${id}/eventlist`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewTransaction(id: string) {
    this.router.navigate([`/admin/manage/org/${id}/transactions`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewDeposits(id: string) {
    this.router.navigate([`/admin/manage/org/${id}/deposits`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewInvoice(id: string) {
    this.router.navigate([`/admin/manage/org/${id}/invoices`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewUsage(id: string) {
    this.router.navigate([`/admin/manage/org/${id}/usage`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  onSelectedPagination(pagedData: any[]): void {
    this.pagedOrgDetails = pagedData;
  }

  convertPercentage(value:number):string{
    return (value * 100).toFixed(2) + '%';
  }
  convertToNumberFormat(value:any):string{

    return value;
  }
  onSelectDayDropDown(event: any): void {
    const selectedMonthYear = event;
    const [year, month] = selectedMonthYear.split(' ');
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;
    const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
    const formattedDate = `${year}-${formattedMonth}-28`;
    this.retrievingOrgDetails(formattedDate);
  }

}
