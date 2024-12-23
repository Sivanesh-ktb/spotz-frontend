import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConst } from 'src/app/app.const';
import { SpaceDTO } from 'src/app/models/search';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { BookingDTO, CartDTO } from 'src/app/utils/cart';
import { CancelingDataComponent } from '../../includes/canceling-data/canceling-data';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.html',
  styleUrls: ['./booking-form.css']
})
export class BookingFormComponent implements OnInit {
  bookingInfoForm!: FormGroup;
  affiliations: string[] = this.appConst.AFFILIATIONS;
  NEW_TEXT = '+ ADD NEW';
  eventNames = this.appConst.EVENT_NAMES;
  behalfInfo = this.appConst.BEHALF_INFO;
  spaceDetails!: SpaceDTO;
  cardDetails!: CartDTO;
  processedSport = '';
  others = this.appConst.OTHER_SPORT;
  constructor(private fb: FormBuilder,
    private appConst : AppConst,
    private authService: AuthService,
    private commonService: CommonService,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.bookingInfoForm = this.fb.group({
      eventName: ['', Validators.required],
      attendance: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      sport: ['', Validators.required],
      otherSport: [''],
      additionalInfo: [''],
      supervisor: this.fb.group({
        myInfo: [false],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        title: [''],
        email: ['', [Validators.required, Validators.email]],
        phon: ['', Validators.required],
        affiliation: ['None'],
        otherAffiliation: [''],
      }),
    });
    this.getBehaviorSubjectDetails();
  }

  submit() {
    if (this.bookingInfoForm.valid) {
        console.log(this.bookingInfoForm.value, 'Booking Info Form...');
        this.cardDetails.booking.eventName = this.bookingInfoForm.get('eventName')?.value;
        this.cardDetails.booking.attendance = this.bookingInfoForm.get('attendance')?.value;
        this.cardDetails.booking.supervisor = this.bookingInfoForm.get('supervisor')?.value;
        this.cardDetails.booking.sport = this.bookingInfoForm.get('sport')?.value;
        this.cardDetails.booking.otherSport = this.bookingInfoForm.get('otherSport')?.value;
        this.cardDetails.booking.details = this.bookingInfoForm.get('additionalInfo')?.value;
        this.commonService.setBookingPageStatus(this.appConst.bookingOption);
        this.commonService.storeCartDetails(this.cardDetails);
     }
    else{
      this.bookingInfoForm.markAllAsTouched();
    }
  }

  cancel() {
    this.matDialog.open(CancelingDataComponent, {
      width: '320px',
      position: { top: '10px' },
    });
  }
  updateSport() {
    const sport = this.bookingInfoForm.get('sport')?.value;
    this.processedSport = sport?.replace(/\s+/g, '').toLowerCase();
    if (this.processedSport === this.others) {
      this.bookingInfoForm.get('otherSport')?.setValidators([Validators.required]);
    } else {
      this.bookingInfoForm.get('otherSport')?.clearValidators();
    }
    this.bookingInfoForm.get('otherSport')?.updateValueAndValidity();
  }

  reverse(){
    this.commonService.setBookingPageStatus(this.appConst.bookingSchedule);
  }
  selectEvent(event:string){
    this.bookingInfoForm.get('eventName')?.setValue(event);
  }
  supervisingDetails(){
    const checkValue = this.bookingInfoForm.get('supervisor.myInfo');
    if(localStorage.getItem('authToken') && !checkValue?.value){
    const authDetails = this.authService.decodeToken(localStorage.getItem('authToken') || '');
    this.bookingInfoForm.get('supervisor.firstName')?.setValue(authDetails.user.UserName);
    this.bookingInfoForm.get('supervisor.lastName')?.setValue(authDetails.user.lastName);
    this.bookingInfoForm.get('supervisor.email')?.setValue(authDetails.user.email);
    this.bookingInfoForm.get('supervisor.phon')?.setValue(authDetails.user.phone);
    }
    else{
      this.bookingInfoForm.get('supervisor.firstName')?.setValue('');
      this.bookingInfoForm.get('supervisor.lastName')?.setValue('');
      this.bookingInfoForm.get('supervisor.email')?.setValue('');
      this.bookingInfoForm.get('supervisor.phon')?.setValue('');
    }
    console.log("supervisingDetails");
  }
  getBehaviorSubjectDetails(){
   this.commonService.spaceDetails$.subscribe((data)=>{
    this.spaceDetails = data;
   });
   this.commonService.cartDetails$.subscribe((data)=>{
    if(data){
      this.cardDetails = data;
      this.setPreviewDetails(data.booking);
    }
   });
  }
  setPreviewDetails(bookingDetails:BookingDTO){
    this.bookingInfoForm.get('eventName')?.setValue(bookingDetails.eventName);
    if(bookingDetails.attendance !== 0){
    this.bookingInfoForm.get('attendance')?.setValue(bookingDetails.attendance);
    }
    this.bookingInfoForm.get('sport')?.setValue(bookingDetails.sport);
    this.bookingInfoForm.get('otherSport')?.setValue(bookingDetails.otherSport);
    this.bookingInfoForm.get('additionalInfo')?.setValue(bookingDetails.details);
    this.bookingInfoForm.get('supervisor.firstName')?.setValue(bookingDetails.supervisor.firstName);
    this.bookingInfoForm.get('supervisor.lastName')?.setValue(bookingDetails.supervisor.lastName);
    this.bookingInfoForm.get('supervisor.title')?.setValue(bookingDetails.supervisor.title);
    this.bookingInfoForm.get('supervisor.email')?.setValue(bookingDetails.supervisor.email);
    this.bookingInfoForm.get('supervisor.phon')?.setValue(bookingDetails.supervisor.phon);
    this.bookingInfoForm.get('supervisor.affiliation')?.setValue(bookingDetails.supervisor.affiliation);
  }
}
