import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-cancel-reservations',
  templateUrl: './cancel-reservations.html',
  styleUrls: ['./cancel-reservations.css',
    '../.././org-event-list-usage/org-event-list-usage.css'],
})
export class CancelReservationsComponent implements OnInit {
  facId = '';
  facName = '';
  orgId = '';
  clearValue!: boolean;
  spaceIds: number[] = [];
  cancelPage = 1;
  spaceNames: string[] = [];
  date: Date | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    private bookingService: BookingService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.orgId = param['orgId'] ?? '';
    });
  }

  onFacilitySelected(event: { id: string; name: string }): void {
    this.facId = event.id;
    this.facName = event.name;
  }

  onSpaceTypeSelected(event:{spaceId:number[],name:string[]}): void {
    this.spaceIds = event.spaceId;
    this.spaceNames = event.name;
  }
  onBookingTypeSelected(event: { name: string[]; value: number[] }): void {
    this.spaceNames = event.name;
    this.cdr.detectChanges();
  }

  clearFilters() {
    this.facId = '';
    this.spaceIds = [];
    this.clearValue = true;
  }

  onDateChange(event: Date): void {
    if (event) {
      this.date = event;
      this.retrievingCancelReservationsData();
    }
  }

  retrievingCancelReservationsData() {
    const dateString = this.date ? this.date.toISOString() : '';
    this.bookingService.getCancelReservationsData(this.orgId, dateString).subscribe(
      (response: any) => {
        if (response.status === 200) {
          // Handle success case
        } else {
          this.toastr.error(response.body.message);
        }
      }
    );
  }
}
