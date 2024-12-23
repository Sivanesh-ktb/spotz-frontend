import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavbarGroupMembersComponent } from '../../navbar-group-members/navbar-group-members';
import { AppConst } from 'src/app/app.const';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ManageOrgGroupService } from 'src/app/services/groups-org.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.html',
  styleUrls: ['./new-group.css']
})
export class NewGroupComponent implements OnInit {
  @ViewChild(NavbarGroupMembersComponent)
  navbarGroupMembersComponent!: NavbarGroupMembersComponent;
  addNewGroup: FormGroup;
  usState: string[] = [''];
  groupName = '[New Group Name]';
  orgId = '';
  groupId = '';
  selectedPriority = 0;
  priorityDropdown: { display: string, value: number }[] = this.appConst.LEVELS_ENUM;
  accessLevel: number;
  selectedLevel: string = this.priorityDropdown[this.priorityDropdown.length - 1].display;

  leadTimeDropdown: number[] = this.appConst.LEAD_TIME_ENUM;
  selectedLeadTime: number = this.leadTimeDropdown[0];
  showAddress = false;
  groupPriv = false;
  groupProof = false;
  @Input() newGroupActive!: boolean;
  @Output() newGroupNameOutput = new EventEmitter<string>();
  constructor(
    private appConst: AppConst,
    private fb: FormBuilder,
    private manageOrgGroupService: ManageOrgGroupService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private viewPortScroller: ViewportScroller
  ) {
    this.accessLevel = this.priorityDropdown.length;
    this.addNewGroup = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      level: [''],
      lead: ['', Validators.required],
      discount: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]],
      showAddress: [''],
      county: [''],
      hood: [''],
      street1: [''],
      street2: [''],
      city: [''],
      state: [''],
      zip: [''],
      instant: ['', Validators.required],
      taxNum: [''],
      system: [''],
      invoice: [''],
      priv: [false],
      showProof: [false],
      proof: this.fb.array([this.createItem()])
    });
  }

  ngOnInit(): void {
    this.usState = this.appConst.usState;
    this.route.paramMap.subscribe(params => {
      this.orgId = params.get('orgId') || '';
      this.groupId = params.get('groupId') || '';
      this.addNewGroup.get('level')?.setValue(this.priorityDropdown[this.priorityDropdown.length - 1].value);
      if(this.groupId){
        this.editCustomGroup();
      }
    });
  }

  get proof(): FormArray {
    return this.addNewGroup.get('proof') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      typ: [1, Validators.required],
      require: [1, Validators.required],
      instructions: ['']
    });
  }

  addProof(): void {
    this.proof.push(this.createItem());
  }

  removeProof(index: number): void {
    if (this.proof.length > 1) {
      this.proof.removeAt(index);
    }
  }
  newGroupName(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      this.groupName = value;
      this.navbarGroupMembersComponent?.addNewGroupName(this.groupName);
      this.newGroupNameOutput.emit(this.groupName);
    }
  }
  isCheckedLeadTime(leadTime: number): boolean {
    return this.selectedLeadTime === leadTime;
  }

  setLeadTime(leadTime: number, index: number): void {
    this.addNewGroup.get('lead')?.setValue(leadTime);
    this.selectedLeadTime = leadTime;
  }

  getStarClass(optionIndex: number, starIndex: number): string {
    const starsRequired = 4 - optionIndex;
    return starIndex < starsRequired ? 'fa-star' : 'fa-star-o';
  }

  showAddressForm(): void {
    this.showAddress = !this.showAddress;
  }

  clearAction(): void {
    this.addNewGroup.patchValue({
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      county: ''
    });
  }

  orgAddGroupNew(): void {
    if (this.addNewGroup.valid) {
      if(this.groupId){
        this.manageOrgGroupService.updateCustomGroup(this.orgId, this.groupId, this.addNewGroup.value).subscribe(
          (response: any) => {
            if(response.status === 200){
              this.toastr.success('Update Group Success'+' '+response.body.name);
              this.router.navigate([`admin/manage/org/${this.orgId}/groups`]);
              return this.viewPortScroller.scrollToPosition([0,0]);
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
      else{
      this.manageOrgGroupService.storeOrgNewGroup(this.orgId, this.addNewGroup.value).subscribe(
        (response: any) => {
          if(response.status === 200){
            this.toastr.success('Save Group Success'+''+response.body.name);
            this.router.navigate([`admin/manage/org/${this.orgId}/groups`]);
          }
          else{
            this.toastr.error(response.body.message);
          }
        },
        error => {
          console.error('Error sending organization name', error);
        }
      );
    }
    } else {
      this.addNewGroup.markAllAsTouched();
    }
  }

  isPrivate(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.addNewGroup.get('priv')?.setValue(checked ? 1 : 0);
    this.groupPriv = checked;
  }
  initProof(event : Event) : void{
    const checked = (event.target as HTMLInputElement).checked;
    this.groupProof = checked;
    this.addNewGroup.get('showProof')?.setValue(checked ? 1 : 0);
  }
  editCustomGroup(){
      console.log(this.groupId);
   return this.manageOrgGroupService.getCustomGroup(this.orgId,this.groupId).subscribe(
        (response: any) => {
          if(response.status === 200){
            console.log(response.body);
            const groupDetails = response.body;
            this.proof.clear();
            if (groupDetails.proof && groupDetails.proof.length > 0) {
                groupDetails.proof.forEach((proofItem: any) => {
                    this.proof.push(this.fb.group({
                        typ: [proofItem.typ, Validators.required],
                        require: [proofItem.require, Validators.required],
                        instructions: [proofItem.instructions]
                    }));
                });
                console.log(this.proof.value);
            }

            this.addNewGroup.patchValue({
              name:groupDetails?.name,
              description:groupDetails?.description,
              level:groupDetails?.level,
              lead:groupDetails?.lead,
              discount:groupDetails?.discount,
              showAddress:groupDetails?.address?.street1? true : false,
              county:groupDetails?.county,
              hood:groupDetails?.hood,
              street1:groupDetails?.address?.street1,
              street2:groupDetails?.address?.street2,
              city:groupDetails?.address?.city,
              state:groupDetails?.address?.state,
              zip:groupDetails?.address?.zip,
              instant:groupDetails?.instant,
              invoice:groupDetails?.invoice? true : false,
              taxNum:groupDetails?.taxNum,
              system:groupDetails?.system,
              priv:groupDetails?.priv? true : false,
              showProof:groupDetails?.proof.length > 0 ? true : false,
              proof:groupDetails?.proof,
            });
            this.groupName = groupDetails?.name;
            this.showAddress = groupDetails?.address?.street1? true : false;
            this.selectedPriority = groupDetails.level;
            this.selectedLeadTime =groupDetails.lead;
            this.groupPriv =groupDetails.priv;
            this.groupProof =groupDetails?.proof.length > 0 ? true : false;
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
  cancelNewGroup(){
    this.router.navigate([`admin/manage/org/${this.orgId}/groups`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  onPrioritySelected(selectedPriority: { display: string, value: number }) {
    this.priorityDropdown = [selectedPriority];
    this.addNewGroup.get('level')?.setValue(selectedPriority.value);
  }
}
