import { Component, Input, OnInit } from '@angular/core';
import { organizationRules } from 'src/app/models/org';

@Component({
  selector: 'app-rules-and-policies',
  templateUrl: './rules-and-policies.html',
  styleUrls: ['./rules-and-policies.css']
})
export class RulesAndPoliciesComponent implements OnInit {

  @Input() organizationDetails:any;
  rulesAndPoliciesPdf:organizationRules[]=[];
  ngOnInit(){
    if(this.organizationDetails){
    this.rulesAndPoliciesPdf = this.organizationDetails.files;
    }
  }

}
