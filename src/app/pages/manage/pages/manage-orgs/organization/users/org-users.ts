
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AppConst } from "src/app/app.const";
import { ManageOrgService } from "src/app/services/manage-org.service";

@Component({
  selector:"app-org-users",
  templateUrl:"./org-users.html",
  styleUrls:['./org-users.css']
})

export class OrgUsersComponent implements OnInit {
  adminRole: string = this.appConst.adminRole;
  approverRole: string = this.appConst.approverRole;
  editorRole: string = this.appConst.editorRole;
  maintenanceManagerRole: string = this.appConst.maintenanceManagerRole;
  maintenanceStaffRole: string = this.appConst.maintenanceStaffRole;
  orgId  ='';
  orgDetails : any;
  adminCount = 0;
  approverCount = 0;
  editorCount = 0;
  maintenanceManagerCount = 0;
  maintenanceStaffCount = 0;
  adminGroupId  = '';
  approverGroupId  = '';
  editorGroupId  = '';
  maintenanceManagerGroupId  = '';
  maintenanceStaffGroupId  = '';
  constructor(
    private appConst: AppConst,
    private manageOrgService : ManageOrgService,
    private route : ActivatedRoute,
    private router : Router,
    private toasr : ToastrService
  ){}

  ngOnInit(){
    this.orgId = this.route.snapshot.paramMap.get('orgId')??'';
    this.getGroupsDetails();
  }
  getGroupsDetails(){
    this.manageOrgService.getOrgGroupsDetails(this.orgId).subscribe(
      (response : any) => {
        if(response.status == 200){
        this.orgDetails = response.body;
        console.log(this.orgDetails);
        for (const group of this.orgDetails) {
          const rank = group.rank;
          switch (rank) {
            case 0:
              this.adminGroupId = group._id;
              this.adminCount = group.members?.length ?? 0;
              break;
            case 1:
              this.approverGroupId = group._id;
              this.approverCount = group.members?.length ?? 0;
              break;
            case 2:
              this.editorGroupId = group._id;
              this.editorCount = group.members?.length ?? 0;
              break;
            case 3:
              this.maintenanceManagerGroupId = group._id;
              this.maintenanceManagerCount = group.members?.length ?? 0;
              break;
            case 4:
              this.maintenanceStaffGroupId = group._id;
              this.maintenanceStaffCount = group.members?.length ?? 0;
              break;
          }
        }
      }
      else{
        console.log(response.body.message);
      this.toasr.error(response.body.message);
      }
      }
    )
  }

  allowOrganizationAccess(id: string) {
    return this.router.navigate([`/admin/manage/org/${this.orgId}/groups/${id}`]);
  }
}


