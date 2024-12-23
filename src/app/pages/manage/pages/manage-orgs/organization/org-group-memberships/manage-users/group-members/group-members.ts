
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConst } from 'src/app/app.const';
import { ManageOrgService } from 'src/app/services/manage-org.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ViewProfileMemberComponent } from '../view-profile-member/view-profile-member';
import { UpdateAccessMemberComponent } from '../update-access-member/update-access-member';
import { ManageOrgGroupService } from 'src/app/services/groups-org.service';
import { DeleteGroupMembersComponent } from '../../delete-group-members/delete-group-members';

@Component({
  selector:'app-group-members',
  templateUrl:'./group-members.html',
  styleUrls:['./group-members.css']
})

export class GroupMembersComponent implements OnInit {
  @Input() groupName = '';
  roleTitle = '';
  orgId  ='';
  groupId  = '';
  membersData : any;
  roleDescription="";
  descriptionTitle='';
  commonRoleOne:string= this.appConst.commonRoleOne;
  commonRoleTwo:string= this.appConst.commonRoleTwo;
  inviteEmail: FormGroup;
  submitted = false;
  totalItems = 0;
  pageSize = 10;
  page = 1;
  pagedOrgDetails: any[] = [];

constructor(
  private route:ActivatedRoute,
  public manageOrgService : ManageOrgService,
  private appConst:AppConst,
  private form: FormBuilder,
  private toastr: ToastrService,
  private dialog: MatDialog,
  private manageOrgGroupService: ManageOrgGroupService
){

  this.inviteEmail = this.form.group({
    email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
  });
}

ngOnInit(){
  this.route.paramMap.subscribe(paramMap => {
    this.orgId = paramMap.get('orgId')??'';
    this.groupId = paramMap.get('groupId')??'';
    if(this.orgId && this.groupId){
    this.getIndividualGroupMembers();
    }
  });
}
getIndividualGroupMembers(){
  this.manageOrgService.getIndividualMemberDetails(this.orgId,this.groupId).subscribe(
    (response : any) => {
      if(response.status === 200){
      this.membersData = response.body.members;
      this.pagedOrgDetails = this.membersData;
      this.roleTitle = response?.body?.groupName;
      this.totalItems = this.membersData.length
      switch(response?.body?.rank){
        case 0:
          this.roleTitle = this.appConst.adminRoleTitle;
          this.roleDescription= this.appConst.adminRole;
          break;
        case 1:
          this.roleTitle = this.appConst.approverRoleTitle;
          this.roleDescription= this.appConst.approverRole;
          break;
        case 2:
          this.roleTitle = this.appConst.editorRoleTitle;
          this.descriptionTitle="Copy and listing editors.";
          this.roleDescription= this.appConst.editorRole;
          break;
        case 3:
          this.roleTitle = this.appConst.maintenanceManagerRoleTitle;
          this.roleDescription= "";
          break;
        case 4:
          this.roleTitle = this.appConst.maintenanceStaffRoleTitle;
          this.roleDescription= "";
          break;
      }

    }
    else{
      this.toastr.error('Error in fetching data');
    }
  }

  )
}
inviteMember(email: string) {
this.manageOrgService.inviteMember(email,this.orgId,this.groupId).subscribe(
  (response : any) => {
    if(response.status === 201){
    this.submitted = false;
    this.inviteEmail.reset();
    this.getIndividualGroupMembers();
    this.toastr.success('Invitation sent successfully');
    }
    else{
      this.toastr.error(response.body.message);
    }
  }
)
}
get formControl() { return this.inviteEmail.controls; }
inviteMemberAccess(){
  this.submitted = true;
  if(this.inviteEmail.valid){
  this.inviteMember(this.inviteEmail.value.email);
  }
  else{
    this.inviteEmail.markAllAsTouched();
  }

}
viewProfile(id: string): void {
  this.dialog.open(ViewProfileMemberComponent, {
    data: { id: id }
  });
}
updateAndRemoveAccess(id:string,userName:string):void{
  this.dialog.open(UpdateAccessMemberComponent,{
    width: '1300px',
    data:{
      uid:id,
      userName:userName,
      orgId:this.orgId,
      groupId:this.groupId,
      membersData:this.membersData
    }
  })
}

delete(id: string,userName: string){
  const dialogRef = this.dialog.open(DeleteGroupMembersComponent, {
    width: '400px',
    data: {
      uid: id,
      orgId: this.orgId,
      groupId: this.groupId,
      userName:userName,
      groupName : this.roleTitle,
    }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result?.message === 'removeUser') {
     this.deleteGroupMember(userName,id);
    }
  });
}
deleteGroupMember(userName: string,id: string){
  this.manageOrgGroupService.deleteGroupMembers(this.orgId,this.groupId,id).subscribe(
    (response: any) => {
      if(response.status === 200){
        this.toastr.success('Delete Membership Success' + ' ' + userName);
        this.getIndividualGroupMembers();
      }
      else{
        this.toastr.error(response.body.message);
      }
    },
    (error) => {
      console.error('Error sending organization name', error);
    }
  );
}

onSelectedPagination(pagedData: any[]): void {
  this.pagedOrgDetails = pagedData;
}
}


