import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { searchRoutes } from 'src/app/models/enums';
import { searchLocationService } from '../../../services/search-location.service';
import { ActivatedRoute, Router } from '@angular/router';
import { facilityData } from 'src/app/models/facility';
import { ViewportScroller } from '@angular/common';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit{
  @Input() searchParams: { proximity: number; spaceType: string } = {
    proximity: 0,
    spaceType: '',
  };
  @Input() page = 0;
  selectedGuestRange = 0;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.select-address') && !target.closest('.search-input') && !target.closest('.address-search')
    && !target.closest('.grid-view')) {
      this.hideAddress = true;
      this.searchAddress = '';
    }
  }
  @HostListener('document:keydown.enter', ['$event'])
  onEnterPress() {
    if (!this.isSearchDisabled) {
      this.search();
    }
  }
  constructor(
    private searchLocationService: searchLocationService,
    private router: Router,
    private route: ActivatedRoute,
    private viewPortScroller: ViewportScroller,
    private appConst: AppConst
  ) {
  }
  org = '';
  data='';
  o='';
  oid='';


  hideAddress=false;
  ngOnInit() {
    this.getSelectedSearchDetails();
  }
  color: ThemePalette = 'primary';
  dateControl = new FormControl();
  minDate   = new Date();
  maxDate   = new Date(new Date().setDate(new Date().getDate() + 30));
  touchUi = false;
  enableMeridian = false;
  disableMinute = false;
  hideTime = false;
  disabled = false;
  typ=this.appConst.locSearch;
  location="";
  date="";
  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
}
addresses: any[] = [];
searchAddress = '';
isSearchDisabled = true;
getAddressDetails(event: Event) {
  const value = this.getInputValue(event).toString();
  this.searchAddress = value;
  this.getAutoCompleteAddress();
}
searchFacility(){
  if(this.searchAddress){
  this.searchLocationService.searchLocation(this.searchAddress).subscribe(
    (response:any) => {
      if (response.status ==200) {
        this.hideAddress = false;
        if (!Array.isArray(this.addresses)) {
          this.addresses = [];
        }
        this.addresses.push(response.body[0]);
      } else {
        this.addresses = [];
      }
    },
    error => {
      console.log(error);
    }
  );
}
else{
  this.addresses=[];
}
}
getAutoCompleteAddress(){
  if(this.searchAddress){
    this.searchLocationService.autoCompleteAddress(this.searchAddress).subscribe(
      (response:any) => {
        if (response.status == 200) {
          this.hideAddress = false;
          this.addresses = response.body?.predictions;
          this.searchFacility();
        } else {
          this.addresses = [];
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  else{
    this.addresses=[];
    this.isSearchDisabled = true;
  }
}

selectAddress(address: facilityData): void {
  this.isSearchDisabled = false;
  this.searchAddress = address.description;
  if(address?.typ){
    this.typ = address.typ;
    this.data = address.data[0]+','+address.data[1];
  }
  if(address.o){
    this.o = address.o;
  }
  if(address.oid){
    this.oid = address.oid;
  }
  if(!address?.typ){
    this.typ = this.appConst.locSearch;
    this.retrievingPlaceDetails(address.place_id);
  }
  this.hideAddress = true;
}
search() {
  if(this.searchAddress){
  const numberOfGuests = { guest: this.selectedGuestRange };
  this.searchAddress = this.searchAddress = this.searchAddress.replace(/,/g, '').replace(/\s+/g, '_');
  const queryParams = { [this.typ]: this.searchAddress,
    data: this.data
  }
  if (this.selectedGuestRange) {
    queryParams['guest'] = String(this.selectedGuestRange);
  }
  if (this.date) {
    const formattedDate = new Date(this.date).toLocaleDateString('en-CA');
    queryParams['date'] = String(formattedDate);
  }
  if(this.o){
    queryParams['o'] = this.o;
  }
  if(this.oid){
    queryParams['oid'] = this.oid;
  }
  if(this.searchParams.proximity){
    queryParams['proximity'] = String(this.searchParams.proximity);
  }
  if(this.searchParams.spaceType){
    queryParams['spaceType'] = this.searchParams.spaceType;
  }
  this.router.navigate([searchRoutes.SEARCH], { queryParams, state: { numberOfGuests } });
  return this.viewPortScroller.scrollToPosition([0,0]);
}
else{
  this.isSearchDisabled = true;
}
}
retrievingPlaceDetails(placeId: string) {
  if(placeId){
  this.searchLocationService.getPlaceDetails(placeId).subscribe(
    (response:any)=>{
      if(response.status === 200){
        this.data = response.body?.result?.geometry?.location?.lng+','+response.body?.result?.geometry?.location?.lat;
      }
    }
  )
 }
}

getSelectedSearchDetails(){
  this.route.queryParams.subscribe((params) => {
    if (params['loc']) {
      this.isSearchDisabled = false;
      this.typ = this.appConst.locSearch;
      this.searchAddress = params['loc'].replace(/_/g, ' ');

    }
    else if (params['fac']) {
      this.isSearchDisabled = false;
      this.typ = this.appConst.facSearch;
      this.searchAddress = params['fac'].replace(/_/g, ' ');
    }
    else if (params['org']) {
      this.typ = this.appConst.orgSearch;
      this.isSearchDisabled = false;
      this.searchAddress = params['org'].replace(/_/g, ' ');
    }
    if (params['date']) {
      this.date = params['date'];
    }
    if (params['guest']) {
      this.selectedGuestRange = Number(params['guest']);
    }
    if (params['data']) {
      this.data = params['data'];
    }
    if(params['o']){
      this.o = params['o'];
    }
    if(params['oid']){
      this.oid = params['oid'];
    }
  }
  );
}
}
