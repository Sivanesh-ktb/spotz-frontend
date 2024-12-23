import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ManageOrgGroupService } from 'src/app/services/groups-org.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css'],
})
export class ManageUsersComponent implements OnInit {
  orgId = '';
  groupId = '';
  groupDetails: any;
  groupName = '';
  system!: number;
  constructor(
    private manageOrgGroupService: ManageOrgGroupService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.orgId = params.get('orgId') ?? '';
      this.groupId = params.get('groupId') ?? '';
      if (this.orgId && this.groupId) {
        this.retrieveGroupDetails();
      }
    });

    this.route.queryParamMap.subscribe((queryParamMap) => {
      const tab = queryParamMap.get('tab');
      this.system = tab ? parseInt(tab, 10) || 0 : 4;
    });
  }
  retrieveGroupDetails() {
    return this.manageOrgGroupService
      .getCustomGroup(this.orgId, this.groupId)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.groupDetails = response.body;
          this.groupName = this.groupDetails?.name;
        }
      });
  }
  groupAccessSave(
    selectedSpaceValues: any[],
    checkedFacValues: any[],
    limited: number
  ) {
    const access = {
      typ: 3,
      limited: limited,
      facs: checkedFacValues,
      spaceTypes: selectedSpaceValues,
    };
    this.groupDetails.access = access;
    if (this.groupId) {
      this.manageOrgGroupService
        .updateCustomGroup(this.orgId, this.groupId, this.groupDetails)
        .subscribe(
          (response: any) => {
            if (response.status === 200) {
              this.toastr.success(
                'Update Group Success' + ' ' + response.body.name
              );
              this.router.navigate([`admin/manage/org/${this.orgId}/groups`]);
            } else {
              this.toastr.error(response.body.message);
            }
          },
          (error) => {
            console.error('Error sending organization name', error);
          }
        );
    }
  }
}
