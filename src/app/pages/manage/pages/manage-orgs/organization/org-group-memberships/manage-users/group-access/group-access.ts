import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConst } from 'src/app/app.const';
import { AuthService } from 'src/app/services/auth.service';
import { CreateOrgComponentService } from 'src/app/services/create-org.service';
import { ManageUsersComponent } from '../manage-users';
import { ManageOrgGroupService } from 'src/app/services/groups-org.service';
import { SpaceType } from 'src/app/models/space';
import { facilityList } from 'src/app/models/facility';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-group-access',
  templateUrl: './group-access.html',
  styleUrls: ['./group-access.css']
})
export class GroupAccessComponent implements OnInit {
  groupDetails:any;
  spaceTypes: SpaceType[] = this.appConst.SPACES_ENUM;
  spaceForm: FormGroup;
  facilityForm: FormGroup;
  orgId = '';
  groupId = '';
  facilities: facilityList[] = [];
  limited  = false;
  groupName = '';
  constructor(
    private appConst: AppConst,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private createOrgService: CreateOrgComponentService,
    private authService: AuthService,
    private toastr: ToastrService,
    private manageUsersComponent: ManageUsersComponent,
    private manageOrgGroupService: ManageOrgGroupService,
    private viewPortScroller: ViewportScroller
  ) {
    this.spaceForm = this.fb.group({});
    this.facilityForm = this.fb.group({});
  }

  ngOnInit() {
   this.sortSpaceTypes();
    this.initializeForms();
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.groupId = paramMap.get('groupId') ?? '';
      if (this.orgId && this.groupId) {
        this.retrievingOrgFacilities();
        this.retrieveGroupDetails();
      }
    });
  }
  retrieveGroupDetails(){
    return this.manageOrgGroupService.getCustomGroup(this.orgId,this.groupId).subscribe(
      (response: any) => {
        if(response.status === 200){
          this.groupDetails = response?.body?.access;
          this.limited = this.groupDetails?.limited?true:false;
          this.groupName = response?.body?.name;
          this.updateForms();
      }
    }
  );
}
updateForms(){
  this.spaceTypes.forEach(spaceType => {
    this.spaceForm.get(spaceType.name)?.setValue(this.groupDetails?.spaceTypes?.includes(spaceType.value));
  }
  );
this.facilities.forEach(facility => {
  this.facilityForm.get(facility.id)?.setValue(this.groupDetails?.facs?.includes(facility.id));
});
}
  sortSpaceTypes(): void {
    this.spaceTypes.sort((a, b) => a.sort - b.sort);
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
      if(!this.limited){
        selectedSpaceValues = [];
        checkedValues = [];
       }
    this.manageUsersComponent?.groupAccessSave(selectedSpaceValues, checkedValues,this.limited?1:0);
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
  cancelAccess(){
    this.router.navigate([`admin/manage/org/${this.orgId}/groups`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  addCustomAccess(event : Event){
  this.limited = (event.target as HTMLInputElement).checked ? true : false;
  }
}
