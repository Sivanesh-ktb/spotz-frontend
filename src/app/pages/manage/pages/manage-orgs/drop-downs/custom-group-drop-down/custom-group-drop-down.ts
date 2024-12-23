import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManageOrgService } from 'src/app/services/manage-org.service';

@Component({
  selector: 'app-custom-group-drop-down',
  templateUrl: './custom-group-drop-down.html',
  styleUrls: ['./custom-group-drop-down.css']
})
export class CustomGroupDropDownComponent implements OnInit {
  dropdownOpen = false;
  groupName = 'Search By Group';
  orgId='';
  clearIcon = false;
  groupLength = 0;
  orgDetails:any;
  selectedGroupTypes: string[] = [];
  groupTypes: number[] = [];
  selectedGroupNames: string[] = [];
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-menu') && !target.closest('.form-control')) {
      this.dropdownOpen = false;
    }
  }
  @Input() multipleSelected !: boolean;
  @Output() groupSelected = new EventEmitter<string[]>();
  constructor(
    private route: ActivatedRoute,
    private manageOrgService: ManageOrgService
  ){

  }

  ngOnInit(): void{
    this.route.paramMap.subscribe(params=>{
      this.orgId = params.get('orgId')??'';
      if(this.orgId){
        this.getGroupMembers();
      }
    })
  }
  getGroupMembers(){
    this.manageOrgService.getOrgGroupsDetails(this.orgId).subscribe(
      (response : any) => {
        if(response.status == 200){
           this.orgDetails = response.body;
           this.groupLength = this.orgDetails.filter((group:any)=>group.system == 0).length;
        }
      }
    )

  }
  clearDropdown(){
    this.groupName = 'Search By Group';
    this.clearIcon = false;
    this.groupSelected.emit(['','']);
  }
  viewUser(groupId : string,groupName : string){
    this.groupName = groupName;
    this.groupSelected.emit([groupId,groupName]);
    this.clearIcon = true;
  }
  toggleGroupType(groupId: string, index: number, name: string): void {
    const selectedIndex = this.selectedGroupTypes.indexOf(groupId);
    if (selectedIndex > -1) {
      this.selectedGroupTypes.splice(selectedIndex, 1);
      this.selectedGroupNames.splice(selectedIndex, 1);
      this.groupTypes.splice(selectedIndex, 1);
      this.groupSelected.emit(this.selectedGroupNames.map((name: string) => name));
    } else {
      this.selectedGroupTypes.push(groupId);
      this.selectedGroupNames.push(name);
      this.groupSelected.emit(this.selectedGroupNames.map((name: string) => name));
      this.groupTypes.push(index);
    }
  }
  isChecked(index: string): boolean {
    return this.selectedGroupTypes.includes(index);
  }
  clearAllGroups(): void {
    this.selectedGroupTypes = [];
    this.selectedGroupNames = [];
    this.groupSelected.emit(this.selectedGroupNames.map((name: string) => name));
  }
}
