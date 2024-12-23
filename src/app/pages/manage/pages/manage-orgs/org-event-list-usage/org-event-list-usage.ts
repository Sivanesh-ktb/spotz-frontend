import { ChangeDetectorRef, Component,AfterViewChecked, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from 'src/app/services/booking.service';
import { CreateOrgComponentService } from 'src/app/services/create-org.service';
import { FacilityService } from 'src/app/services/facility.service';
import { SpaceService } from 'src/app/services/space.service';
import { WorkOrdersService } from 'src/app/services/work-orders.service';

@Component({
  selector: 'app-org-event-list-usage',
  templateUrl: './org-event-list-usage.html',
  styleUrls: ['./org-event-list-usage.css']
})
export class OrgEventListUsageComponent implements OnInit, AfterViewChecked {
  clearValue !:boolean;
  orgId  = '';
  facId = '';
  facilities : any;
  spaceTypes: any;
  spaceIds: number[] = [];
  advancedFilter !: boolean ;
  sportTypes: string[] = [];
  attendance = '';
  bookingTypeName:string[]=[];
  bookingType: number[] = [];
  startDate  = '';
  endDate  = '';
  page = 0;
  currentPage = '';
  checkPage = 1;
  facilityId='';
  spaceId = '';
  groupMultipleSelection = true;
  flatten !: boolean;
  selectedGroupTypes: string[] = [];
  orgDetailsForFac: any;
  facilityDetails: any;
  facName = '';
  url='organizations';
  spaceDetails: any;
  bookingData: any;
  spaceNames: string[] = [];
  selectedStatus: { name: string[]; value: number[] } = { name: [], value: [] };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private workOrdersService : WorkOrdersService,
    private bookingService: BookingService,
    private facilityService: FacilityService,
    private createOrgService: CreateOrgComponentService,
    private spaceService: SpaceService,
    private cdr: ChangeDetectorRef
  ){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getRouteFromUrl(event.urlAfterRedirects);
      }
    });
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  ngOnInit() : void{
    this.route.paramMap.subscribe((params) => {
    this.orgId = params.get('orgId')??'';
    this.facilityId = params.get('facilityId')??'';
    this.spaceId = params.get('spaceId')??'';
    if(this.orgId && this.facilityId && this.spaceId){
      this.getSpace();
    }
    else if(this.facilityId && !this.spaceId){
      this.retrieveFacilityData();
      this.getSpaceDetails(this.facilityId,'facilities');
    }
    else if(this.orgId){
      this.getSpaceDetails(this.orgId,'organizations');
    }
    else if(!this.orgId && !this.facilityId && !this.spaceId && this.startDate && this.endDate){
      this.getUserBookingDetails();
    }

     })

  }
  onFacilitySelected(event: { id: string; name: string }): void {
    this.facId = event.id;
    this.facName = event.name;
  }

onSpaceTypeSelected(event:{spaceId:number[],name:string[]}): void {
  this.spaceNames = event.name;
}
onBookingTypeSelected(event: { name: string[]; value: number[] }): void {
  this.bookingTypeName = event.name;
  this.bookingType = event.value;
  this.cdr.detectChanges();
}
onAttendanceSelected(event: { id: number, name: string }) {
  this.attendance = event.name;
}
showAdvanceFilter(){
  this.advancedFilter = !this.advancedFilter;
}
onSportTypeSelected(sportType: string[]) : void{
  this.sportTypes = sportType;
}
onSelectedDateRange(event: { startDate: string, endDate: string }) {
  this.startDate = event.startDate;
  this.endDate = event.endDate;
  if(this.orgId && this.startDate && this.endDate && this.checkPage === 1){
  this.retrievingWorkOrders();

  }
  else if(this.orgId && this.startDate && this.endDate && this.checkPage === 2){
    this.flatten = true;
    this.url="organizations";
    this.searchBookingsData(this.orgId,this.url);
  }
  else if(this.orgId && this.startDate && this.endDate && this.checkPage === 3){
    this.url="organizations";
    this.searchBookingsData(this.orgId,this.url);
  }
  else if(this.facilityId && this.startDate && this.endDate && this.checkPage === 4){
    this.url="facilities";
    this.searchBookingsData(this.facilityId,this.url);
  }
  else if(this.spaceId && this.facilityId && this.startDate && this.endDate && this.checkPage === 5){
    this.url="spaces";
    this.searchBookingsData(this.spaceId,this.url);
  }
  else if(!this.orgId && !this.facilityId && !this.spaceId && this.startDate && this.endDate && this.checkPage === 4){
    this.getUserBookingDetails();
  }
}
clearFilters(){
  this.facId = '';
  this.spaceIds = [];
  this.sportTypes = [];
  this.attendance = '';
  this.bookingType = [];
  this.spaceTypes = [];
  this.advancedFilter = false;
  this.clearValue = true;
}
retrievingWorkOrders(){
  this.workOrdersService.getOrgWorkOrders(this.orgId,this.startDate,this.endDate).subscribe(
    (response:any) =>{
      if(response.status === 200){
        console.log(response.body);
      }
      else{
        this.toastr.error(response.body.message);
      }
    }
  )
}
getRouteFromUrl(url: string) : string {
  if(url.includes('usage')){
    this.currentPage = 'Usage';
    this.checkPage = 2; // usage
    this.advancedFilter = true;
    return 'usage';
  }
  else if(url.includes('schedule')){
    this.currentPage = 'Reservations';
    this.checkPage = 3; // schedule
    this.advancedFilter = false;
    return 'schedule';
  }
  else if(url.includes('reservations') && url.includes('space')){
    this.currentPage = 'Reservations';
    this.checkPage = 5; // schedule
    this.advancedFilter = false;
    return 'reservations';
  }
  else if(url.includes('reservations') && url.includes('account')){
    this.currentPage = 'Reservations';
    this.checkPage = 6; // user reservations
    this.advancedFilter = false;
    return 'reservations';
  }
  else if(url.includes('reservations')){

    this.currentPage = 'Reservations';
    this.checkPage = 4; // schedule
    this.advancedFilter = false;
    return 'reservations';
  }
  else{
    this.currentPage = 'Event List';
    this.checkPage = 1;
    this.advancedFilter = false;
    return 'eventlist';
  }

}
onOriginSelected(event: {title:string,value:number}): void {
  console.log(event);
}
onGroupSelected(event: string[]): void {
  this.selectedGroupTypes = event;
}
onBookingTypeFilterSelected(event: { name: string[]; value: number[] }): void {
  this.selectedStatus = event;
}
searchBookingsData(Id:string,url:string){
  this.bookingService.retrievingBookingsData(Id,this.startDate,this.endDate,this.flatten,url).subscribe(
    (response:any)=>{
      if(response.status === 200){
        this.bookingData = response.body;
      }
      else{
        this.toastr.error(response.body.message);
      }
    }
  );
}
  retrieveFacilityData(){
    if(this.facilityId){
      this.facilityService.getOneFacilityDetails(this.facilityId).subscribe(
        (response: any) => {
          if(response.status == 200){
          this.orgDetailsForFac = response.body.org;
          this.facilityDetails = response.body;
          this.facName = this.facilityDetails?.name;
          this.spaceDetails = response?.body?.spaces;
        }
        else{
          this.toastr.error(response.body.message);
        }
        }
      )
    }
  }
  getSpaceDetails(id:string,url:string) {
    this.createOrgService.retrieveOrgSpaceDetails(id,url).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.spaceDetails = response.body;
          } else {
          this.toastr.error(response?.body?.message);
        }
      }
    )
  }
  getSpace(){
    this.spaceService.getSpaceDetails(this.spaceId).subscribe(
      (response :any) => {
        if(response.status === 200){
        this.spaceDetails = response.body;
       const facUrl = this.spaceDetails?.fac?.gdUrl;
        this.facName =  facUrl.substring(facUrl.lastIndexOf('/') + 1);
          }
        else{
          this.toastr.error(response.body.message)
        }
      }
    )
  }
  refreshData(){
   if(this.facilityId && this.startDate && this.endDate && this.checkPage === 6){
    this.url="facilities";
   return this.searchBookingsData(this.facilityId,this.url);
   }
   else if(!this.orgId && !this.facilityId && !this.spaceId && this.startDate && this.endDate && this.checkPage === 4){
    this.getUserBookingDetails();
   }
  }
  getUserBookingDetails(){
    if(this.startDate && this.endDate){
    this.bookingService.getUserBookingDetails(this.startDate,this.endDate).subscribe(
      (response: any) => {
        if(response.status === 200){
          this.bookingData = response.body;
        }
        else{
          this.toastr.error(response.body.message);
        }
      }
    )
  }
  }
}
