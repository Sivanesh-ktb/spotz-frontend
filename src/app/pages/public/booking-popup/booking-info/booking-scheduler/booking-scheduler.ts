import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConst } from 'src/app/app.const';
import { SpaceDTO} from 'src/app/models/space';
import { LoginComponent } from 'src/app/pages/auth/login/login.component';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { StatusCode } from 'src/app/status-code';

@Component({
  selector: 'app-booking-scheduler',
  templateUrl: './booking-scheduler.html',
  styleUrls: ['./booking-scheduler.css']
})
export class BookingSchedulerComponent implements OnInit {
  date!: Date | null | string | undefined;
  searchDate!: Date | null | string | undefined;
  minDate = new Date();
  spaces = [
    { id: 1, name: 'Diamond' },
    { id: 2, name: 'Space-1 1A - Des' },
    { id: 3, name: 'Multiple - mixed' },
    { id: 4, name: 'First Space' }
  ];
  isDatepickerOpen = false;
  isRecurring = false;
  page!: number;

  @Input() spaceDetails!: SpaceDTO;
  @Input() facDetails! : SpaceDTO[];
  selectedSpace : SpaceDTO = {};
  @Output() spaceSelected = new EventEmitter<SpaceDTO>()
  @Output() navigateToSchedule = new EventEmitter<void>();
  bookingSchedule = this.appConst.bookingSchedule;

  constructor(
    private appConst: AppConst,
    private commonService: CommonService,
    private dialog: MatDialog,
    private userService:UserService
  ) {
  }

  ngOnInit(){
    this.searchDate = this.commonService.getEventDate()?.toISOString().split('T')[0];
    this.setSelectedRecurring();
  }
  setSelectedRecurring() {
    this.commonService.recurringSource$.subscribe(recurring => {
      this.isRecurring = recurring;
    });
  }
  toggleDatepicker() {
    this.isDatepickerOpen = !this.isDatepickerOpen;
  }

  onSpaceSelected(space: SpaceDTO) {
    this.selectedSpace = space;
    this.spaceSelected.emit(this.selectedSpace);
  }

  onDateSelected(date: Date) {
    this.searchDate = date;
    if (this.searchDate) {
      this.commonService.setEventDate(this.searchDate);
    } else {
      console.log('Selected date is undefined');
    }
  }

  navigateToBookingSchedule(){
    const checkUser = localStorage.getItem('id');
    if(checkUser){
    this.getPropertyDetails();
    this.page = this.bookingSchedule;
    this.navigateToSchedule.emit();
    this.commonService.setInfoButtonStatus(true);
    this.commonService.setBookingPageStatus(this.appConst.bookingSchedule);
    }
    else{
      this.dialog.open(LoginComponent, {
        width: '400px',
        disableClose: false,
        data: { showSignup: true }
      });
    }
  }
  changeRecurring(toggle: boolean) {
    this.commonService.setRecurring(toggle);
  }
  getPropertyDetails(){
    this.userService.getUserPropertiesDetails().subscribe(
      (response: HttpResponse<object>)=>{
        if(response.status === StatusCode.SUCCESS){
          console.log('property details:',response.body);
        }
        else{
          console.log('error in getting property details');
        }
      }
    )
  }
}
