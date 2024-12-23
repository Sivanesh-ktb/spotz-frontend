import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { BookingSpaceDTO, SpaceDTO } from 'src/app/models/search';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CartDTO, CartUtils } from 'src/app/utils/cart';
import { ConfirmationPopupComponent } from 'src/app/pages/manage/pages/manage-orgs/space/space-settings/confirmation-popup/confirmation-popup';

@Component({
  selector: 'app-update-search',
  templateUrl: './update-search.html',
  styleUrls: ['./update-search.css']
})
export class UpdateSearchComponent implements OnInit {
  searchDate !:any;
  minDate = new Date();
  selectedDate !: string;
  isRecurring = false;
  showRecurring = true;
  spaceDetails !:SpaceDTO;
  facDetails! : SpaceDTO[];
  space!: BookingSpaceDTO;
  searchChanged = false;
   updateSearch = true;
  initialSearchDate = new Date();
  cart!: CartDTO;
  selectedSpace: SpaceDTO={
    id: '',
    name: '',
    IsRefundable: false,
  };
  @Output() navigateToUpdateSchedule = new EventEmitter<void>();
  bookingSchedule = this.appConst.bookingSchedule;
  showScore = false;

  public loading = false;
  public listing: any = {};
  public savedSettings: any;
  public results: any;
  public filter: any;
  public timeRange: number[] = [10, 46];
  public level = 0;
  public datepickerOptions: any;
  public dateIx = 0;

  private subscriptions: Subscription = new Subscription();
  initialRadioState!: boolean;

  constructor(
    private commonService : CommonService,
    private appConst: AppConst,
    private dialogService: MatDialog,
    private cartService: CartUtils
  ){

  }
  ngOnInit(){
    this.getBehaviorSubjectDetails();
    this.loadInitialDate();
    this.initialRadioState = this.isRecurring;
  }
   getBehaviorSubjectDetails() {
    this.subscriptions.add(
      this.commonService.spaceDetails$.subscribe((data) => {
        this.spaceDetails = data;
      })
    );

    this.subscriptions.add(
      this.commonService.facilityDetails$.subscribe((data) => {
        this.facDetails = data;
      })
    );

    this.subscriptions.add(
      this.commonService.recurringSource$.subscribe((recurring) => {
        this.isRecurring = recurring;
        this.showRecurring = this.isRecurring;
      })
    );

    this.subscriptions.add(
      this.commonService.setShowScore$.subscribe((score) => {
        this.showScore = score;
      })
    );

    this.subscriptions.add(
      this.commonService.spaceAvailableDetails$.subscribe((space) => {
        this.space = space;
      })
    );

    this.commonService.cartDetails$.subscribe((data) => {
      if (data) {
        this.cart = data;
      }
    });

    this.commonService.selectedSpace$.subscribe(space => {
      this.selectedSpace = space;
    });

  }
  private loadInitialDate(): void {
    const eventDate = this.commonService.getEventDate();

    if(eventDate){
      this.searchDate = eventDate;
    } else {
      this.searchDate = new Date();
    }
    if (!this.initialSearchDate) {
      this.initialSearchDate = this.searchDate;
    }
    this.selectedDate = this.commonService.getFormattedDate(this.searchDate);
  }
  changeRecurring(status: boolean){
    this.isRecurring = status;
    this.showRecurring = status;
    this.searchChanged = true;
    this.commonService.setRecurring(this.isRecurring);
    this.commonService.setShowScoreValue(this.showScore);
  }

  updateBookingSchedule() {
 this.initialRadioState = this.isRecurring;
    this.searchChanged = true;
    if ((this.space && this.space.data.length> 0 && (this.selectedSpace.name !== this.space.data[0].spaces[0].name) &&
     (this.cart?.booking && this.cart?.booking.children && this.cart?.booking.children.length > 0)) ||
     this.cart?.booking && this.cart?.booking.children && this.cart?.booking.children.length > 0) {
      const dialogRef = this.dialogService.open(ConfirmationPopupComponent, {
        width: '400px',
        data: {
          type: this.appConst.SWITCHSPACE,
          name: this.selectedSpace.name
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.status === this.appConst.SWITCHSPACE) {
          this.cart.booking.children = [];
          this.cart.error.days = [];
          this.commonService.storeCartDetails(this.cart);
          this.cartService.cancel(this.cart);
          this.cartService.processBooking.calculate();
          this.proceedWithSearch();
        }else {
          this.searchChanged = false;
        }
      });
    } else {
      this.proceedWithSearch();
    }
  }

  private proceedWithSearch() {
    this.navigateToUpdateSchedule.emit();
    this.searchChanged = false;
    this.initialSearchDate = this.searchDate;
    this.commonService.setRecurring(this.isRecurring);
    this.commonService.setEventDate(this.searchDate);
  }

  onDateSelected(date: Date) {
    this.searchDate = date;
    this.selectedDate = this.commonService.getFormattedDate(date);
    this.searchChanged = true;
  }

  resetForm() {
     if (this.initialSearchDate) {
      this.searchDate = this.initialSearchDate;
      } else {
      this.searchDate = new Date();
     }
    this.isRecurring = this.initialRadioState;
    this.showRecurring = this.isRecurring;
    this.selectedDate = this.commonService.getFormattedDate(this.searchDate);
    this.searchChanged = false;
    this.commonService.clearCartDetails();
  }
}
