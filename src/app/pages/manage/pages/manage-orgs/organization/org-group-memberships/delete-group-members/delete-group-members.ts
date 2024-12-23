import { HttpResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppConst } from 'src/app/app.const';
import { ManageOrgService } from 'src/app/services/manage-org.service';

@Component({
  selector: 'app-delete-group-members',
  templateUrl: './delete-group-members.html',
  styleUrls: ['./delete-group-members.css']
})
export class DeleteGroupMembersComponent {
  heading  = '';
  contentOne = '';
  contentTwo = '';
  uid = '';
  orgId = '';
  groupId = '';
  userName = '';
  groupName  = '';
  email = '';
  userDetails: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appConst : AppConst,
    private dialogRef : MatDialogRef<DeleteGroupMembersComponent>,
    private manageOrgService: ManageOrgService,
    private toastr : ToastrService
  ){
    this.uid = data['uid'];
    this.orgId = data['orgId'];
    this.groupId = data['groupId'];
    this.userName = data['userName'];
    this.groupName = data['groupName'];
    this.email = data['email'];
    if(!this.uid && this.orgId && this.groupId){
      this.heading = this.appConst.removeGroupTitle;
      this.contentOne = this.appConst.removeGroupContentOne;
      this.contentTwo = this.appConst.removeGroupContentTwo + this.groupName;
    }
    else if(this.uid && this.orgId && this.groupId && this.groupName){
    this.deleteUserDetails();
    }
    else if(this.uid && this.orgId && this.groupId){
      this.heading = this.appConst.removeMemberTitle;
      this.contentOne = this.appConst.removeMemberContentOne;
      this.contentTwo = this.userName;
    }
  }
  dismissPopup(){
    this.dialogRef.close();
  }
  deleteUserDetails(){
    this.manageOrgService.getIndividualUserDetails(this.uid).subscribe(
      (response: HttpResponse<any>) => {
        if(response.status === 200) {
          this.userDetails = response.body;
          this.heading = this.appConst.removeUser;
          this.contentOne = this.userName + '('+  this.userDetails?.email+')';
          this.contentTwo = this.appConst.removeUserContent + this.groupName;
        } else {
          this.toastr.error(response.body.message);
        }
      },
      (error) => {
        this.toastr.error(error.error.message);
        console.error('Error fetching user details:', error);
      }
    );
  }
  remove(){
   if(!this.uid && this.orgId && this.groupId){
    this.dialogRef.close({
      orgId: this.orgId,
      groupId: this.groupId,
      message: 'removeGroup'
    });
    }
    else if (this.uid && this.orgId && this.groupId && this.groupName) {
      this.dialogRef.close({
        orgId: this.orgId,
        groupId: this.groupId,
        message: 'removeUser'
      });
    }
    else if (this.uid && this.orgId && this.groupId) {
      this.dialogRef.close({
        orgId: this.orgId,
        groupId: this.groupId,
        message: 'removeMember'
      });
    }

}
}
