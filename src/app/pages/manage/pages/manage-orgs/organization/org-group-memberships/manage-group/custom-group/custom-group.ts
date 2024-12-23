import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConst } from 'src/app/app.const';
import { ManageOrgGroupService } from 'src/app/services/groups-org.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-custom-group',
  templateUrl: './custom-group.html',
  styleUrls: ['./custom-group.css']
})
export class CustomGroupComponent implements OnInit{

 newGroup = false;
 orgId = '';
 groupId = '';
 customGroupDetails: any;
 groupDetails: any[] = [];
 filterText = '';
 email = '';
 clearIcon = false;
 priorityDropdown: { display: string, value: number }[] = this.appConst.LEVELS_ENUM;
 selectedLevel: string = this.priorityDropdown[this.priorityDropdown.length - 1].display;
 constructor(
    private router: Router,
    private route: ActivatedRoute,
    private manageOrgGroupService: ManageOrgGroupService,
    private appConst: AppConst,
    private viewPortScroller: ViewportScroller
  ){

  }
  ngOnInit() : void{
    this.route.paramMap.subscribe(params => {
      this.orgId = params.get('orgId') || '';
      this.groupId = params.get('groupId') || '';
      if(this.orgId){
        this.retrieveGroupDetails();
      }
      if(this.groupId){
        this.newGroup = true;
      }
    });
  }
  retrieveGroupDetails(){
    this.manageOrgGroupService.retrieveGroupMembersDetails(this.orgId).subscribe(
      (response : any) => {
        if(response.status === 200){
           this.groupDetails = response.body;
            this.customGroupDetails = this.groupDetails;
            this.customGroupDetails = this.groupDetails.filter(group => group.system === 0);
        }
        else{
          console.log(response);
        }
      }
  );
  }
  filterTextGroup(filterText:string){
    this.filterText = filterText;
    this.filterGroup();
  }
  filterGroup(){
    if (this.filterText.trim() === '') {
      this.customGroupDetails = this.groupDetails;
    } else {
      this.customGroupDetails = this.groupDetails.filter((group: any) =>
        group.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }
  }
  clearSearch(){
    this.email = '';
    this.clearIcon = false;
    this.filterText='';
    this.retrieveGroupDetails();
  }
  searchMember(){
    // this.filterText= this.email;
    if(this.email){
    this.clearIcon = true;
    this.manageOrgGroupService.searchMembersDetails(this.orgId, this.email).subscribe(
      (response : any) => {
        if(response.status === 200){
          this.groupDetails = response.body.data;
          this.customGroupDetails = this.groupDetails;
        }
        else{
          console.log(response);
        }
      },
      (error) => {
        console.log(error);
      }
  );
}
else{
  this.retrieveGroupDetails();
}
  }
  addNewGroup(){
    this.router.navigate([`/admin/manage/org/${this.orgId}/new/group`],
      { queryParams: { 'new-group': 'true' } }
    );
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewGroup(id:string){
    this.router.navigate([`admin/manage/org/${this.orgId}/groups/${id}`],
      { queryParams: { tab: 0 }}
    );
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewGroupList(){
    this.newGroup = false;
    this.retrieveGroupDetails();
  }
  allowOrganizationAccess(id: string) {
    this.router.navigate([`/admin/manage/org/${this.orgId}/groups/${id}`],
      { queryParams: { tab: 1 }}
    );
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  allowOrganizationReport(id:string){
    this.router.navigate([`/admin/manage/org/${this.orgId}/groups/${id}`],
      { queryParams: { tab: 3 }}
    );
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  selectedLevelText(level: number) {
    const selectedItem = this.priorityDropdown.find(item => item.value === level);
    if (selectedItem) {
      this.selectedLevel = selectedItem.display;
    } else {
      this.selectedLevel = 'Unknown';
    }
    return this.selectedLevel;
  }
  getStarClass(starIndex: number, memberLevel: number): string {
    return starIndex < memberLevel ? 'fa-star' : 'fa-star-o';
  }

}
