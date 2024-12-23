import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-availability-rules',
  templateUrl: './availability-rules.html',
  styleUrls: ['./availability-rules.css']
})
export class AvailabilityRulesComponent implements OnChanges {
  availabilityRule = false;
  @Input() orgId !: string;
  @Input() availabilityRoleType!:string;
  @Input() spaceAvailabilityData !: any;
  @Input() groupDetails:any;
  @Input() spaceDetails:any;
  @Input() viewMode: 'list' | 'grid' = 'list';
  @Output() refreshNewData = new EventEmitter();
  filterData: any;
   constructor(
    private router: Router,
    private viewPortScroller: ViewportScroller
   ){

   }
ngOnChanges(): void {
  if(this.availabilityRoleType == 'availability'){
    this.filterData = this.spaceAvailabilityData.filter((data:any) => data.type === 1);
  }
  else if(this.availabilityRoleType == 'exception'){
    this.filterData = this.spaceAvailabilityData.filter((data:any) => data.type === -1);
  }
  else if(this.availabilityRoleType == 'assignment'){
    this.filterData = this.spaceAvailabilityData.filter((data:any) => data.type === -2);
  }
}
   showRules(){
    this.availabilityRule = !this.availabilityRule;
   }
   viewGroups(){
    this.router.navigate([`/admin/manage/org/${this.orgId}/groups`]);
    return this.viewPortScroller.scrollToPosition([0,0]);   }
    onReFreshData(){
     this.refreshNewData.emit();
    }
    viewHomePage(){
      this.router.navigate(['/']);
    }
}
