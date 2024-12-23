
import { ViewportScroller } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { adminRoutes } from 'src/app/models/enums';
import { deleteManageOrg } from 'src/app/services/detele.manage.org.service';
import { AppConst } from 'src/app/app.const';


@Component({
  selector: 'app-delete-manage-organization',
  templateUrl: './delete-manage-organization.component.html',
  styleUrls: ['./delete-manage-organization.component.css']
})
export class DeleteManageOrganizationComponent implements OnInit {
  displayName = '';
  spaceId  = '';
  facId  = '';
  orgId  = '';
  facName  = '';
  deletecontent: any;
  parent_content = '';
  child_content  = '';
  heading  = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deleteService : deleteManageOrg,
    private toastr : ToastrService,
    private router : Router,
    private viewPortScroller : ViewportScroller,
    private dialogRef : MatDialogRef<DeleteManageOrganizationComponent>,
    private appConst : AppConst
  ){
    this.displayName = data.displayName;
    this.spaceId = data.spaceId;
    this.facId = data.facId;
    this.orgId = data.orgId;
    this.facName = data.facName;

  }

  ngOnInit() {
    if(this.orgId && this.facId && this.spaceId){
      this.heading = this.appConst.spaces_Heading
      this.parent_content = this.appConst.spaces_parent_text;
      this.child_content = this.appConst.spaces_child_text

      console.log(this.parent_content);
      console.log(this.child_content);
    }
    else if (this.orgId && this.facId && !this.spaceId){
      this.heading = this.appConst.facility_Heading
      this.parent_content = this.appConst.facility_parent_text;
      this.child_content = this.appConst.facility_child_text
    }
    else if (this.orgId && !this.facId && !this.spaceId){
      this.heading = this.appConst.organization_Heading
      this.parent_content = this.appConst.organization_parent_text;
      this.child_content = this.appConst.organization_child_text
    }
  }

  dismissPopup(){
  this.dialogRef.close();
  }


  deleteOrgManage() {
    if (this.spaceId) {
      this.deleteService.deleteOrgManage(this.orgId, this.facId, this.spaceId).subscribe(
        (response: any) => {
          this.handleDeleteResponse(response, `admin/manage/org/${this.orgId}/facility/${this.facId}/spaces`);
        },
        (error) => {
          this.toastr.error(error.message || 'An error occurred while deleting the space.');
        }
      );
    } else if (this.facId) {
      this.deleteService.deleteOrgManage(this.orgId, this.facId, this.spaceId).subscribe(
        (response: any) => {
          this.handleDeleteResponse(response, `admin/manage/org/${this.orgId}` );
        },
        (error) => {
          this.toastr.error(error.message || 'An error occurred while deleting the facility.');
        }
      );
    } else if (this.orgId) {
      this.deleteService.deleteOrgManage(this.orgId, this.facId, this.spaceId).subscribe(
        (response: any) => {
          localStorage.removeItem('orgName');
          this.handleDeleteResponse(response, adminRoutes.ADMIN_DASHBOARD);
        },
        (error) => {
          this.toastr.error(error.message || 'An error occurred while deleting the organization.');
        }
      );
    }
  }

  handleDeleteResponse(response: any, navigateTo: string) {
    if (response.status === 200) {
      this.toastr.success('This Organization Details' + ' ' + response.body.message);
      this.dialogRef.close();
      this.router.navigate([navigateTo]);
      return this.viewPortScroller.scrollToPosition([0, 0]);
    } else {
      this.toastr.error(response.body.message);
    }
  }

}
