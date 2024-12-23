import { ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageOrgService } from 'src/app/services/manage-org.service';
import { ManageOrgGroupService } from 'src/app/services/groups-org.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteGroupMembersComponent } from '../delete-group-members/delete-group-members';
import { MatDialog } from '@angular/material/dialog';
import { AppConst } from '../../../../../../../app.const';

  @Component({
    selector: 'app-navbar-group-members',
    templateUrl: './navbar-group-members.html',
    styleUrls: ['./navbar-group-members.css'],
  })
  export class NavbarGroupMembersComponent implements OnInit ,OnChanges {
    @Input() groupName = '';
    @Input() system!: number;
    orgId = '';
    groupId = '';
    orgDetails: any;
    adminGroupId = '';
    approverGroupId = '';
    editorGroupId = '';
    maintenanceManagerGroupId = '';
    maintenanceStaffGroupId = '';
    groupDetails: any;
    filterText = '';
    viewPageName = 'Select group...';
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private manageOrgService: ManageOrgService,
      private viewPortScroller: ViewportScroller,
      private manageOrgGroupService: ManageOrgGroupService,
      private toastr: ToastrService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private appConst : AppConst
    ) {}
    ngOnChanges() {
      if(this.groupName){
      this.viewPageName = this.groupName;
      }
    }
    ngOnInit() {
      this.route.paramMap.subscribe((paramMap) => {
        this.orgId = paramMap.get('orgId') ?? '';
        this.groupId = paramMap.get('groupId') ?? '';
        this.getGroupMembers();
        if (this.orgId && this.groupId) {
          this.retrieveGroupDetails();
        }
      });
      if(this.groupName){
      this.viewPageName = this.groupName;
      }
      this.route.queryParamMap.subscribe((queryParamMap) => {
        const tab = queryParamMap.get('tab');
      if (tab) {
        this.system = tab ? parseInt(tab, 10) || 0 : 3;
      }
      });
    }
    retrieveGroupDetails() {
      return this.manageOrgGroupService
        .getCustomGroup(this.orgId, this.groupId)
        .subscribe((response: any) => {
          if (response.status === 200) {
            this.groupDetails = response.body;
            console.log(this.groupDetails, 'groupDetails');
          }
        });
    }
    getGroupMembers() {
      this.manageOrgService
        .getOrgGroupsDetails(this.orgId)
        .subscribe((response: any) => {
          if (response.status == 200) {
            this.orgDetails = response.body;
            for (const group of this.orgDetails) {
              if (group.system == 1) {
                const rank = group.rank;
                switch (rank) {
                  case 0:
                    this.adminGroupId = group._id;
                    break;
                  case 1:
                    this.approverGroupId = group._id;
                    break;
                  case 2:
                    this.editorGroupId = group._id;
                    break;
                  case 3:
                    this.maintenanceManagerGroupId = group._id;
                    break;
                  case 4:
                    this.maintenanceStaffGroupId = group._id;
                    break;
                }
              }
            }
          }
        });
    }
    viewUser(groupId: string, name: string) {
      this.viewPageName = name;
    if (this.viewPageName === this.appConst.ADMIN ||
      this.viewPageName === this.appConst.APPROVER ||
      this.viewPageName === this.appConst.EDITOR ||
      this.viewPageName === this.appConst.MAINTENANCE_MANAGER ||
      this.viewPageName === this.appConst.MAINTENANCE_STAFF) {
      this.system = this.appConst.SYSTEM_GROUP_STATUS;
    }else {
      this.system = this.appConst.CUSTOM_GROUP_STATUS;
    }
    this.router.navigate([
      `admin/manage/org/${this.orgId}/groups/${groupId}`,
    ],
      { queryParams: { tab: this.system } }
    );
    }
    viewContactInformation(name: string) {
      console.log(name);
      this.viewPageName = name;
      this.router.navigate([`admin/manage/org/${this.orgId}/groups`]);
      return this.viewPortScroller.scrollToPosition([0, 0]);
    }
    addNewGroupName(name: string): void {
      this.viewPageName = name;
    }
    deleteGroup() {
      const dialogRef = this.dialog.open(DeleteGroupMembersComponent, {
        width: '400px',
        data: {
          orgId: this.orgId,
          groupId: this.groupId,
          groupName: this.groupName,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result?.message === 'removeGroup') {
          console.log('delete group');
          this.removeGroup();
        }
      });
    }
    removeGroup() {
      this.manageOrgGroupService
        .removeGroupDetails(this.orgId, this.groupId)
        .subscribe((response: any) => {
          if (response.status === 200) {
            this.toastr.success(response.body.message);
            this.router.navigate([`admin/manage/org/${this.orgId}/groups`]);
          } else {
            this.toastr.error(response.body.message);
            console.log(response.body.message);
          }
        });
    }
    addNewGroup() {
    this.router.navigate([`/admin/manage/org/${this.orgId}/new/group`],
      { queryParams: { 'new-group': 'true' } }
    );
    this.groupDetails = {};

    this.route.queryParamMap.subscribe((queryParamMap) => {
      const tab = queryParamMap.get('tab');
      this.system = tab ? parseInt(tab, 10) || 0 : 3;
     });
    }
  }

