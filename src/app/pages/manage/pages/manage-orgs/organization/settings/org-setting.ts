
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { retrievingOrgDetailsService } from 'src/app/services/retrieving-org.service';


@Component({
  selector: 'app-org-setting',
  templateUrl: './org-setting.html',
  styleUrls: ['./org-setting.css'],
})

export class OrgSettingsComponent implements OnInit {
  orgId = '';
  templates: any[] = [];
  orgDetails : any;
  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private retrievingOrgDetailsService: retrievingOrgDetailsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap =>{
      this.orgId = paramMap.get('orgId')??'';
      if(this.orgId){
        this.retrievingOrgDetails(this.orgId);
      }
    })
  }

  retrievingOrgDetails(orgId: string){
    this.retrievingOrgDetailsService.getOrgSpaceTemplates(orgId).subscribe(
      (response: any)=>{
        if(response.status === 200){
          this.templates = response.body.templates;
          this.orgDetails = response?.body;
            }
      }
    )
  }
  onCallOrgAPI(){
    this.retrievingOrgDetails(this.orgId);
  }

}

