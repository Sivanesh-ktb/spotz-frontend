import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-org-group',
  templateUrl: './org-group.html',
  styleUrls: ['./org-group.css']
})
export class OrgGroupComponent implements OnInit {
  orgId  = '';
  groupId  = '';
  newGroup  = false;
  system  = 3;
  groupName  = '';
  constructor(
    private route:ActivatedRoute,
    private router: Router
  ){

  }
  ngOnInit(){
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId')??'';
      this.groupId = paramMap.get('groupId')??'';
    });
    this.route.queryParamMap.subscribe(queryParamMap => {
      this.newGroup = queryParamMap.get('new-group') === 'true';
      if(this.newGroup){
        this.system = 0;
      }
    });

  }
  onNewGroupNameOutput(event: string){
    console.log('event name');
    console.log(event);
     this.groupName = event;
  }
}
