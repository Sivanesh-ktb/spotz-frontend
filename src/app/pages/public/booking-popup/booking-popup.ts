import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConst } from 'src/app/app.const';
import { FacilityDTO, Params } from 'src/app/models/search';
import { Filter, RecurringFilterParams, SpaceDTO } from 'src/app/models/space';
import { CommonService } from 'src/app/services/common.service';
import { PublicService } from 'src/app/services/public.service';
import { searchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-booking-popup',
  templateUrl: './booking-popup.html',
  styleUrls: ['./booking-popup.css']
})
export class BookingPopupComponent implements OnInit {
  bookingInfo = this.appConst.bookingInfo;
  bookingSchedule = this.appConst.bookingSchedule;
  bookPage = this.appConst.bookPage;
  bookingUsageDetails = this.appConst.bookingUsageDetails;
  bookingOption = this.appConst.bookingOption;
  bookingPayment = this.appConst.bookingPayment;
  bookingVerify = this.appConst.bookingVerify;
  bookingDone = this.appConst.bookingDone;
  page = 0;
  facId = '';
  spaceId = '';
  spaceDetails: SpaceDTO = {};
  facDetails: SpaceDTO[] = [];
  banner = '';
  amenities: string[] = [];
  facName='';
  orgName ='';
  proximity = 0;
  mapHeight = '';
  spaceType = '';
  facData!: FacilityDTO;
  selectedSpace: SpaceDTO = {};
  params!: Params ;
  eventDate: Date | null = null;
  checkRecurring=false;
  recurringFilterData!: Filter;
  activePage!: number;
  notAllowInfo = false;
  recurringFilterParams: RecurringFilterParams = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { row: FacilityDTO },
    private publicService: PublicService,
    private commonService: CommonService,
    private searchService: searchService,
    private appConst: AppConst,
  ) {

  }

  ngOnInit() {
    if (this.data.row?.spaces && this.data.row.spaces.length > 0) {
      this.spaceId = this.data.row.spaces[0].id;
      this.banner = this.data.row.image?.url || '';
      this.amenities = this.data.row.amenity;
      this.facName = this.data.row.name;
      this.orgName = this.data.row.info?.o?.name || '';
      this.facData = this.data.row;
      this.getViewSpaceDetails(this.spaceId);
      this.commonService.setSelectedFacName(this.facName);
      this.commonService.setSelectedOrgName(this.orgName);
      this.getSpaceDetails();
    }
    else if(this.data.row?._id){
        this.spaceId = this.data.row._id;
        this.banner = this.data.row.image?.url || '';
        this.amenities = this.data.row?.amenity || [];
        this.facName = this.data.row.name;
        this.orgName = this.data.row.info?.o?.name || '';
        this.facData = this.data.row;
        this.setSearchParams();
        this.getViewSpaceDetails(this.spaceId);
        this.commonService.setSelectedFacName(this.facName);
        this.commonService.setSelectedOrgName(this.orgName);
        this.getSpaceDetails();
        this.getSearchParamDetails();
    }
     this.commonService.infoPageStatus$.subscribe((data)=>{
      if(data){
        this.notAllowInfo = data;
    }
    });
  }

  onCurrentPage(event: number) {
    this.page = event;
  }

  getSpaceDetails() {
    if(this.facId){
    this.publicService.retrieveSpaceDetails(this.facId).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.facDetails = response.body;
          this.commonService.setFacilityDetails(this.facDetails);
        }
      }
    );
  }
  }

  getViewSpaceDetails(spaceId: string) {
    this.publicService.getSpaceDetails(spaceId).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.spaceDetails = response.body;
          this.facName = this.spaceDetails?.fac?.name || '';
          this.orgName = this.spaceDetails?.fac?.name ?? '';
          this.commonService.setSelectedFacName(this.facName);
          this.commonService.setSelectedOrgName(this.orgName);
          this.commonService.setSpaceDetails(this.spaceDetails);
          this.facId = response.body.fac._id;
          this.getSpaceDetails();
        }
        else {
          console.log('error in getting space details');
        }
      }
    )
  }

  navigateToBookingSchedule() {
    this.page = this.bookingSchedule;
    this.onCurrentPage(this.page);
     this.setSearchParams();
     this.searchBooking(this.recurringFilterParams);
  }

  searchBooking(params: RecurringFilterParams){
    this.commonService.setLoaderResponse(true);
    this.searchService.allOrgAndFacDetails(params).subscribe(
      (response: any) => {
       if (response && response.body) {
        this.commonService.setSpaceAvailableDetails(response.body);
          if(response.body.data && response.body.data.length > 0){
            this.commonService.setAvailabilityStatus(true);
            this.commonService.setLoaderResponse(true);
          }
          else{
            this.commonService.setAvailabilityStatus(false);
            this.commonService.setLoaderResponse(false);
          }
          if(this.checkRecurring){
            this.commonService.setShowScoreValue(true);
            this.commonService.setLoaderResponse(true);
          }
          else{
            this.commonService.setShowScoreValue(false);
            this.commonService.setLoaderResponse(false);
          }
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
  getSearchParamDetails(){
    this.commonService.selectedSpace$.subscribe(space => {
      this.selectedSpace = space;
    });
    this.commonService.eventDate$.subscribe(date => {
      this.eventDate = date;
    });
    this.commonService.recurringSource$.subscribe(recurring => {
      this.checkRecurring = recurring;
    });
    this.commonService.filterValues$.subscribe(params => {
      this.recurringFilterData = params;
    });
    this.commonService.searchSpaceDetails$.subscribe(status=>{
      if(status){
        this.searchBooking(this.recurringFilterParams);
      }
    });
    this.commonService.bookingPageStatus$.subscribe((data)=>{
      this.page = data;
     })
  }
  setSearchParams(){
    this.getSearchParamDetails();
    this.page = this.bookingSchedule;
    this.clearPreviousData();
    const date = (this.eventDate && this.eventDate instanceof Date) ? this.eventDate : new Date(this.eventDate || Date.now());
    this.recurringFilterParams.searchDate = date.toISOString().split('T')[0];
    this.recurringFilterParams.spa = this.selectedSpace._id || "";
    if(this.checkRecurring){
      this.checkEnds();
      if(this.recurringFilterData && this.recurringFilterData.repeat.rules.type ==
        this.appConst.dayFilterType){
         this.dailySearchData();
      }
      else if(this.recurringFilterData && this.recurringFilterData.repeat.rules.type ==
        this.appConst.weekFilterType){
        this.weeklySearchData();
      }
      else if(this.recurringFilterData && this.recurringFilterData.repeat.rules.type ==
        this.appConst.monthFilterType
      ){
         this.monthlySearchData();
      }
    }
}
  dailySearchData(){
    this.recurringFilterParams.daily = 0;
  }
  weeklySearchData(){
    this.recurringFilterParams.weekly = this.appConst.searchWeekDays
    .filter((day, index) => this.recurringFilterData.repeat.rules.day[index].checked)
    .join(',');
  }
  monthlySearchData(){
    this.recurringFilterParams.monthly = this.recurringFilterData.repeat.rules.date.selected;
  }
  checkEnds(){
    if(this.recurringFilterData.repeat.rules.end.rule == 0){
      this.recurringFilterParams.end = this.recurringFilterData.repeat.rules.end.data[0];
    }
    else{
      this.recurringFilterParams.end = this.recurringFilterData.repeat.rules.end.data[1];
   }
  }
  clearPreviousData(){
    this.recurringFilterParams = {};
  }
}
