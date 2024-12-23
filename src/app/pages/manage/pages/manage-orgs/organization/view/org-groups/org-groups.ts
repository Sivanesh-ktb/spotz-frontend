import { ViewportScroller } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConst } from 'src/app/app.const';
import { ManageOrgGroupService } from 'src/app/services/groups-org.service';

@Component({
  selector: 'app-org-groups',
  templateUrl: './org-groups.html',
  styleUrls: ['./org-groups.css',
    '../../../../../../../../assets/css/manage-org-common.css',

  ]
})
export class OrgGroupsComponent implements OnInit {
  @Input() orgId!:string;
  groupDetails: any[] = []; // Assume this gets populated with your data
  customGroupDetails: any;
  priorityDropdown: { display: string, value: number }[] = this.appConst.LEVELS_ENUM;
  selectedLevel: string = this.priorityDropdown[this.priorityDropdown.length - 1].display;
  constructor(
    private router : Router,
    private viewPortScroller:ViewportScroller,
    private route: ActivatedRoute,
    private manageOrgGroupService: ManageOrgGroupService,
    private appConst: AppConst
  ){

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap =>{
      this.orgId = paramMap.get('orgId') ?? '';
      if(this.orgId){
        this.getGroupDetails();
      }
    })

  }
  getGroupDetails(){
    this.manageOrgGroupService.retrieveGroupMembersDetails(this.orgId).subscribe(
      (response : any) => {
        if(response.status === 200){
          console.log(response.body);
           this.groupDetails = response.body;
           this.customGroupDetails = this.groupDetails.filter(group => group.system === 0).slice(0, 5);
        }
        else{
          console.log(response);
        }
      }
  );
  }
  viewGroup(id:string){
    return this.router.navigate([`admin/manage/org/${this.orgId}/groups/${id}`]);
  }
  selectedLevelText(level: number){
    if (level && level > 0 && level <= this.priorityDropdown.length) {
     this.selectedLevel = this.priorityDropdown[level - 1].display;
   } else {
     this.selectedLevel = this.priorityDropdown[this.priorityDropdown.length - 1].display;
   }
   return this.selectedLevel;
 }
 getStarClass(starIndex: number, memberLevel: number): string {
   return starIndex < memberLevel ? 'fa-star' : 'fa-star-o';
 }
  editGroups(){
    this.router.navigate([`admin/manage/org/${this.orgId}/groups`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }

}
