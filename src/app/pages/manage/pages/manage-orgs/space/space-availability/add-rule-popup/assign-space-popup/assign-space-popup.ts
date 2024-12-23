import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-assign-space-popup',
  templateUrl: './assign-space-popup.html',
  styleUrls: ['./assign-space-popup.css']
})
export class AssignSpacePopupComponent {
  link='';
  capacity='';
  description='';
  internal = true;
  assign = false;
  group='';
  uid='';
  msg='';
  selectedGroupUser:any;
  @Input() orgId !: string;
  @Input() groups !: any;
  @Input() formValid !: boolean;
  @Output() selectedDetails = new EventEmitter<{ link: string, capacity: string, description: string, internal: boolean, assign: boolean, group: object, uid: string,members:object,msg:string }>();
  @Output() formValidChange = new EventEmitter<boolean>();
  groupMembers : any;
  groupUsers =[{
    _id: '',
    email: '',
    firstName: '',
    lastName: '',
    uid: ''
  }];
  selectedGroupId = '';
  selectedGroup:any;
  constructor(
    private userService:UserService
  ){

  }

  assignChecked() {
    this.selectedGroupId='';
    this.uid = '';
    this.assign = !this.assign;
    this.assignSpaceFormValid();
    if (this.assign) {
      this.groupMembers = this.groups.filter((group: any) => group.system === 1);
    }
  }

  updateInternal() {
    this.selectedGroupId='';
    this.uid = '';
    this.assign = false;
    this.internal = !this.internal;
    this.assignSpaceFormValid();
    if (!this.internal) {
      this.groupMembers = this.groups.filter((group: any) => group.system === 0);
    }
  }
  selectGroup(event: Event) {
    this.groupUsers = [];
    this.selectedGroupId = (event.target as HTMLSelectElement).value;
    this.selectedGroup = this.groups.find((group: any) => group._id === this.selectedGroupId);
    if (this.selectedGroup) {
      this.selectedGroupId = this.selectedGroup._id;
      const memberUIDs = this.selectedGroup.members.map((member: any) => member.uid).join(',');
      if(memberUIDs){
        this.userService.getUsersByUIDs(memberUIDs).subscribe((response: any) => {
          if(response.status  === 200){
              this.groupUsers = response.body;
          }
        }
      )
      }
    }
  }
  updateData(){
    this.selectedGroupDetails();

  }
  selectedMembersDetails(){
   this.selectedGroupUser = this.groupUsers.filter((user:any) => user._id == this.uid);
   this.selectedGroupDetails();
   this.assignSpaceFormValid();
  }
  selectedGroupDetails(){
    this.selectedDetails.emit({ link: this.link, capacity: this.capacity, description: this.description, internal: this.internal, assign: this.assign, group: this.selectedGroup, uid: this.uid,members:this.selectedGroupUser, msg:this.msg });
  }
  assignSpaceFormValid(){
    if(this.assign || !this.internal){
        if(!this.selectedGroupId && !this.uid){
        this.formValid= true;
        this.formValidChange.emit(this.formValid);
      }
      else{
        this.formValid = false;
        this.formValidChange.emit(this.formValid);
      }
    }
    else{
      this.formValid = false;
      this.formValidChange.emit(this.formValid);
    }
  }

}
