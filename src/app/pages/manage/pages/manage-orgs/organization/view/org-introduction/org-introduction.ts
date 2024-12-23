import { Component, Input, OnInit } from '@angular/core';
import { OrgViewComponent } from '../org-view';

@Component({
  selector: 'app-org-introduction',
  templateUrl: './org-introduction.html',
  styleUrls: ['./org-introduction.css',
    '../../../../../../../../assets/css/manage-org-common.css',
  ]
})
export class OrgIntroductionComponent implements OnInit {
  @Input() orgDescription!: string;
  @Input() editOrgDescription!: boolean;
  description ='';
  constructor(
    private orgViewComponent: OrgViewComponent,
  ) { }
  ngOnInit(): void {

    this.description = this.orgDescription;
  }
  editDescription(){
    this.editOrgDescription = true;
  }
  saveDescription(){
   this.editOrgDescription = false;
   this.orgViewComponent.saveOrgDescription(this.description);
  }
  cancelDescription(){
    this.editOrgDescription = false;
  }
}
