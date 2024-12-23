import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { searchDTO } from 'src/app/models/search';
import { address } from 'src/app/models/space';
import { BookingPopupComponent } from 'src/app/pages/public/booking-popup/booking-popup';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-space-list-template',
  templateUrl: './space-list-template.html',
  styleUrls: ['./space-list-template.css'],
})
export class SpaceListTemplateComponent implements OnInit{
  @Input() filteredfacility!: searchDTO[];
  org="";
  loc="";
  fac="";

  constructor(
    private dialog : MatDialog,
    private route: ActivatedRoute,
    private commonService: CommonService
  ){}

  ngOnInit() {
    this.route.queryParamMap.subscribe(param=>{
      this.org = param.get('org')??'';
      this.loc = param.get('loc')??'';
      this.fac= param.get('fac')??'';
      })
  }
  
  viewSpacePage(address: address, orgName: string, spaceId: string, facName: string) {
    if (address && orgName && spaceId) {
      const orgName = localStorage.getItem('orgName');
      const url = `/${address.state}/${address.city}/orgs/${orgName}/facilities/${facName}/${spaceId}`;
      const newTab = window.open(url, '_blank');
      if (newTab) {
        newTab.onload = function () {
          newTab.scrollTo(0, 0);
        };
      }
    }
  }

  viewFacilityPage(address: address, orgName: string, facId: string){
    if (address && orgName && facId) {
      const url = `/${address.state}/${address.city}/orgs/${orgName}/facilities/${facId}`;
      const newTab = window.open(url, '_blank');
      if (newTab) {
        newTab.onload = function () {
          newTab.scrollTo(0, 0);
        };
      }
    }
  }

  viewOrgPage(address: address, orgName: string, facId: string){
    if (address && orgName && facId) {
      const url = `/${address.state}/${address.city}/orgs/${orgName}`;
      const newTab = window.open(url, '_blank');
      if (newTab) {
        newTab.onload = function () {
          newTab.scrollTo(0, 0);
        };
      }
    }
  }

  bookNow(row: searchDTO){
    this.removePreviewsSearchData();
    const dialogRef =this.dialog.open(BookingPopupComponent,{
      width:'100%',
      maxWidth: '95vw',
      position:{top:'20px'},
      data:{
        row: row,
      }
    });
    dialogRef.afterClosed().subscribe(result=>{
      if (result?.status === 1) return; 

    })
   }

   removePreviewsSearchData(){
    this.commonService.removeSearchData();
  }
  getAssetUrl(row: searchDTO): string {
    return row?.assets && row.assets.length > 0 ? row.assets[0].url : '';
  }
}
