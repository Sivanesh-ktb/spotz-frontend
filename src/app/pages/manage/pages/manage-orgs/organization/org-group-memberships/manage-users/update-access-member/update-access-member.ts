
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConst } from 'src/app/app.const';
import { facilityList } from 'src/app/models/facility';
import { SpaceType } from 'src/app/models/space';
import { AuthService } from 'src/app/services/auth.service';
import { CreateOrgComponentService } from 'src/app/services/create-org.service';
import { ManageOrgGroupService } from 'src/app/services/groups-org.service';
import { ManageOrgService } from 'src/app/services/manage-org.service';
import { DeleteGroupMembersComponent } from '../../delete-group-members/delete-group-members';

@Component({
  selector: 'app-update-access-member',
  templateUrl: './update-access-member.html',
  styleUrls: ['./update-access-member.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAccessMemberComponent implements OnInit {
  uid: string;
  orgId = '';
  groupId = '';
  groupDetails: any;
  updateMember: any;
  accessType = 0;
  active = 0;
  approve = 0;
  spaceTypes: SpaceType[] = [];
  facilities: facilityList[] = [];
  spaceForm: FormGroup;
  facilityForm: FormGroup;
  membersData: any;
  notify = false;
  userName = '';

  constructor(
    public manageOrgService: ManageOrgService,
    private toastr: ToastrService,
    private appConst: AppConst,
    private createOrgService: CreateOrgComponentService,
    private fb: FormBuilder,
    private authService: AuthService,
    private manageOrgGroupService: ManageOrgGroupService,
    public dialogRef: MatDialogRef<UpdateAccessMemberComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private dialog: MatDialog,

  ) {
    this.uid = data['uid'];
    this.orgId = data['orgId'];
    this.groupId = data['groupId'];
    this.membersData = data['membersData'];
    this.userName = data['userName'];
    if (this.orgId) {
      this.retrievingOrgFacilities();
      this.spaceTypes = this.appConst.SPACES_ENUM;
    }
    this.spaceForm = this.fb.group({});
    this.facilityForm = this.fb.group({});
  }
  ngOnInit() {
    this.membersData.filter((member: any) => member.uid === this.uid).map((member: any) => {
      this.updateMember = member;
    });
    this.updateForms();
  }
  selectAllType(form: FormGroup, items: any[]): void {
    items.forEach(item => {
      form.get(item.name)?.setValue(true);
    });
  }

  removeAllType(form: FormGroup, items: any[]): void {
    items.forEach(item => {
      form.get(item.name)?.setValue(false);
    });
  }

  selectAllSpaceTypes(): void {
    this.selectAllType(this.spaceForm, this.spaceTypes);
  }

  removeAllSpaceTypes(): void {
    this.removeAllType(this.spaceForm, this.spaceTypes);
  }

  selectAllFacilities(): void {
    this.selectAllFacilityType(this.facilityForm, this.facilities);
  }
  selectAllFacilityType(form: FormGroup, items: any[]): void {
    items.forEach(item => {
      form.get(item.id)?.setValue(true);
    });
  }
  removeAllFacilities(): void {
    this.removeAllFacilityType(this.facilityForm, this.facilities);
  }
  removeAllFacilityType(form: FormGroup, items: any[]): void {
    items.forEach(item => {
      form.get(item.id)?.setValue(false);
    });
  }
  showContentButton() {
    this.accessType = 0;
  }
  facilitiesAndSpace() {
    this.accessType = 1;
  }
  closeUpdateDialog() {
    this.dialogRef.close();
  }
  initializeForms(): void {
    this.spaceForm = this.fb.group(
      this.spaceTypes.reduce((acc, spaceType) => {
        acc[spaceType.name] = new FormControl(false);
        return acc;
      }, {} as { [key: string]: FormControl })
    );
    this.facilityForm = this.fb.group(
      this.facilities.reduce((acc, facility) => {
        acc[facility.id] = new FormControl(false);
        return acc;
      }, {} as { [key: string]: FormControl })
    );
    this.updateForms();
    this.active = this.updateMember?.active;
    this.approve = this.updateMember?.approve;
    const fac = Object.values(this.facilityForm?.value).filter(value => value === true).length;
    const space = Object.values(this.spaceForm?.value).filter(value => value === true).length;
    this.accessType = fac > 0 || space > 0 ? 1 : 0;
  }

  sortSpaceTypes(): void {
    this.spaceTypes.sort((a, b) => a.sort - b.sort);
  }
  retrievingOrgFacilities() {
    this.createOrgService.retrieveOrgDetails(this.orgId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.facilities = response.body.facilities;
          this.initializeForms();
        } else {
          this.toastr.error(response.body.message);
        }
      },
      error => {
        if (error.status === 401) {
          this.authService.authLogout();
        }
        console.log(error);
      }
    );
  }
  updateForms() {
    this.notify = this.updateMember?.notify;
    this.spaceTypes.forEach(spaceType => {
      this.spaceForm.get(spaceType.name)?.setValue(this.updateMember?.spaceTypes?.includes(spaceType.value));
    });
    this.facilities.forEach(facility => {
      this.facilityForm.get(facility.id)?.setValue(this.updateMember?.facs?.includes(facility.id));
    });
  }
  saveAccess() {
    let selectedSpaceValues = Object.keys(this.spaceForm.controls)
      .filter(key => this.spaceForm.get(key)?.value)
      .map(key => {
        const spaceType = this.spaceTypes.find(space => space.name === key);
        return spaceType ? spaceType.value : null;
      }
      );
    let checkedValues = Object.keys(this.facilityForm.controls)
      .filter(key => {
        const control = this.facilityForm.get(key);
        return control && control.value;
      })
      .map(key => {
        const facility = this.facilities.find(fac => fac.id === key);
        return facility ? facility.id : null;
      })
      .filter(id => id !== null);
    if (this.accessType == 0) {
      selectedSpaceValues = [];
      checkedValues = [];
    }
    this.updateMemberAccess(selectedSpaceValues, checkedValues, this.accessType, this.active, this.approve);
  }
  saveMemberAccess() {
    this.active = 2;
    this.approve = 2;
    this.saveAccess();
  }
  updateMemberAccess(selectedSpaceValues: any[], checkedFacValues: any[], accessType: number,
    active: number, approve: number) {
    this.updateMember.access = {
      typ: 3,
      limited: this.updateMember?.access?.limited,
      facs: checkedFacValues,
      spaceTypes: selectedSpaceValues
    }
    this.updateMember.active = active;
    this.updateMember.approve = approve;
    this.updateMember.facs = checkedFacValues;
    this.updateMember.spaceTypes = selectedSpaceValues;
    this.updateMember.accessType = accessType;
    this.updateMember.notify = this.notify;
    if (this.groupId) {
      this.manageOrgGroupService.updateGroupMembers(this.orgId, this.groupId, this.uid,
        this.updateMember).subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.toastr.success('Save Membership Success'+ ' ' + this.userName);
            this.dialogRef.close();
          }
          else {
            this.toastr.error(response.body.message);
          }
        },
        (error) => {
          console.error('Error sending organization name', error);
        }
      );
    }
  }
  removeAllAccess() {
    const dialogRef = this.dialog.open(DeleteGroupMembersComponent, {
      width: '300px',
      data: {
        uid: this.uid,
        orgId: this.orgId,
        groupId: this.groupId,
        userName: this.userName,
        membersData: this.membersData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.message === 'removeMember') {
        this.active = -2;
        this.approve = -2;
        this.saveAccess()
      }
    });

  }
}

