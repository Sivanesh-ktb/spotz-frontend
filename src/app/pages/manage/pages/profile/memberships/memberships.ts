import { Component, OnInit } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-memberships',
  templateUrl: './memberships.html',
  styleUrls: ['./memberships.css']
})
export class MembershipsComponent implements OnInit {
  page = 1;
  pageSize = 10;
  totalItems = 0;
  memberships:any = [];
  priorityDropdown: { display: string, value: number }[] = this.appConst.LEVELS_ENUM;
  pagedOrgDetails: any[] = [];
  constructor(
    private userService: UserService,
    private appConst: AppConst
  ){

  }

  ngOnInit(){
this.getMemberships();
  }

  getMemberships(){
    this.userService.getUserMemberships().subscribe(
      (response:any)=>{
        if(response.status === 200){
          console.log(response.body);
          this.memberships = response.body;
          this.totalItems = response.body.length;
          console.log('response received');
        }
      }
    )
  }
  selectedLevelText(level: number) {
    const selectedItem = this.priorityDropdown.find(item => item.value === level);
    if (selectedItem) {
      return selectedItem.display;
    } else {
      return '';
    }
  }
  onSelectedPagination(pagedData: any[]): void {
    console.log('pagedData', pagedData);
    this.pagedOrgDetails = pagedData;
  }
}
