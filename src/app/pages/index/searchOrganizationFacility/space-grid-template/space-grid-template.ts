import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { searchDTO } from 'src/app/models/search';
import { address } from 'src/app/models/space';
import { BookingPopupComponent } from 'src/app/pages/public/booking-popup/booking-popup';
import { CommonService } from 'src/app/services/common.service';
import { CartDTO, CartUtils } from 'src/app/utils/cart';


@Component({
  selector: 'app-space-grid-template',
  templateUrl: './space-grid-template.html',
  styleUrls: ['./space-grid-template.css'],
})
export class SpaceGridTemplateComponent implements OnInit{
  @Input() addresses!: searchDTO[];
  @Input() filteredfacility!: searchDTO[];
  org="";
  loc="";
  fac="";
  cart !: CartDTO;
  constructor(
    private dialog : MatDialog,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private cartService: CartUtils
  ){

  }
  ngOnInit() {
    this.route.queryParamMap.subscribe(param=>{
      this.org = param.get('org')??'';
      this.loc = param.get('loc')??'';
      this.fac= param.get('fac')??'';
      })
      this.commonService.cartDetails$.subscribe((data) => {
        if (data) {
          this.cart = data;
        }
      });
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
    this.commonService.setFetchDates(true);
    if(this.cart && this.cart.booking && this.cart.booking.children){
    this.cart.booking.children = [];
    this.cart.error.days = [];
    this.commonService.storeCartDetails(this.cart);
    this.cartService.cancel(this.cart);
    this.cartService.processBooking.calculate();
    }
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
