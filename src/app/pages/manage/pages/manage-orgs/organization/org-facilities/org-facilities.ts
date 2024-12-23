import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateOrgComponentService } from 'src/app/services/create-org.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-org-facilities',
  templateUrl: './org-facilities.html',
  styleUrls: ['./org-facilities.css']
})
export class OrgFacilitiesComponent implements OnInit {

  pagedOrgDetails: any[] = [];
  orgDetails  = '';
  orgId ='';
  orgFacDetails : any = {};
  filterText = '';
  filteredFacilities: any[] = [];
  checkFilter  = false;
  totalItems = 0;
  pageSize = 10;
  page = 1;
  admin!:boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private organizationService : CreateOrgComponentService,
    private toastr: ToastrService,
    private viewPortScroller: ViewportScroller
  ){

  }

  ngOnInit(){
    this.route.paramMap.subscribe(paramMap =>{
      this.orgId = paramMap.get('orgId')??'';
    })
    if(this.orgId){
      this.getFacilities();
    }
    this.admin = (localStorage.getItem('role') == environment.superAdminRole);
  }
getFacilities(){
  this.organizationService.getOrgFacilities(this.orgId).subscribe(
    (response: any)=>{
      if(response.status == 200){
        this.orgFacDetails = response.body;
        this.filteredFacilities = this.orgFacDetails;
        this.totalItems = this.filteredFacilities.length;
      }
      else{
        this.toastr.error(response.body.message);
      }
    },
    (error : any)=>{
      this.toastr.error(error.message);
    }
  )
}
viewFacility(facId: string){
  console.log(facId);
  this.router.navigate([`admin/manage/org/${this.orgId}/facility/${facId}`]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
editFacility(facId: string){
  this.router.navigate([`admin/manage/org/${this.orgId}/facility/edit/${facId}`]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
viewSpaces(facId: string){
  this.router.navigate([`admin/manage/org/${this.orgId}/facility/${facId}/spaces`]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
addSpace(facId : string){
  this.router.navigate([`admin/manage/org/${this.orgId}/facility/${facId}/space/new`]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
filterFacilities(){
  if (this.filterText.trim() === '') {
    this.filteredFacilities = this.orgFacDetails;
    this.checkFilter = false;
  } else {
    this.checkFilter = true;
    this.filteredFacilities = this.orgFacDetails.filter((fac: any) =>
      fac.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }
}
addFacility(){
  this.router.navigate([`admin/manage/org/${this.orgId}/facility/new`]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
clearFilter(){
  this.filterText = '';
  this.checkFilter = false;
  this.filteredFacilities = this.orgFacDetails;
}


onSelectedPagination(pagedData: any[]): void {
  this.pagedOrgDetails = pagedData;
}

}
