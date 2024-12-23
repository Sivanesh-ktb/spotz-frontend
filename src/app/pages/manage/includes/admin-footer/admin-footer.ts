
import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector:'app-admin-footer',
  templateUrl:'./admin-footer.html',
  styleUrls:['./admin-footer.css']
})
export class AppFooterComponent implements OnInit{

  orgId='';
  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private viewPortScroller: ViewportScroller
  ){

  }
  ngOnInit(){
    this.orgId = localStorage.getItem('orgIdCheck') ?? '';
  }
  manageOrg(url:string){
    this.router.navigate([`/admin/manage/org/${this.orgId}/${url}`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
}

