import { Component, Input, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { BookingService } from 'src/app/services/booking.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-org-calendar-filter',
  templateUrl: './org-calendar-filter.html',
  styleUrls: ['./org-calendar-filter.css'],
})
export class OrgCalendarFilterComponent implements OnInit {
  selectedType = 'week';
  scheduleDate = new Date();
  scheduleCalendarDate = new Date();
  formattedDate = '';
  facId = '';
  spaceId = '';
  endDate = new Date();
  dateHeaders: Date[] = [];
  timeSlots: string[] = [];
  @Input() spaceDetails  : any;
  @Input() spaceCalendar  = false
  @Input() userCalendar !: boolean;
  daysInMonth: (number | null)[] = [];
  scheduleData:any;
  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.updateFormattedDate();
    this.generateTimeSlots();

    this.route.params.subscribe(params => {
      this.facId = params['facilityId'] ?? '';
      this.spaceId = params['spaceId'] ?? '';
      this.setDefaultEndDate();
      this.generateDateHeaders(this.scheduleDate, 7);
    });
    if(this.userCalendar){
      this.getUserCalendarDetails();
    }
  }

  isTodayDisabled(): boolean {
    const today = new Date();
    return this.scheduleDate.toDateString() === today.toDateString();
  }
  
  generateDateHeaders(startDate: Date, days: number) {
    const start = new Date(startDate);
    this.dateHeaders = [];
    for (let date = 0; date < days; date++) {
      const current = new Date(start);
      current.setDate(start.getDate() + date);
      this.dateHeaders.push(current);
    }
  }


  generateTimeSlots() {
    const times = [];
    for (let hour =5; hour < 24; hour++) {
      const ampm = hour >= 12 ? 'pm' : 'am';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      times.push(`${displayHour}${ampm}`);
    }
    this.timeSlots = times;
  }
  setDefaultEndDate() {
    this.endDate.setDate(this.scheduleDate.getDate() + 7);
      this.retrievingData();
  }
  updateFormattedDate() {
    const dayName = formatDate(this.scheduleDate, 'EEEE', 'en-US');
    const day = formatDate(this.scheduleDate, 'd', 'en-US');
    const month = formatDate(this.scheduleDate, 'MMMM', 'en-US');
    const year = formatDate(this.scheduleDate, 'yyyy', 'en-US');

    if (this.selectedType === 'day' || this.selectedType === 'dayTwo') {
      this.endDate = new Date(this.scheduleDate);
      this.formattedDate = `${dayName}, ${month} ${day}, ${year}`;
    } else if (this.selectedType === 'threeDay') {
      this.endDate = new Date(this.scheduleDate);
      this.endDate.setDate(this.endDate.getDate() + 2);
      const endDay = formatDate(this.endDate, 'd', 'en-US');
      const endMonth = formatDate(this.endDate, 'MMMM', 'en-US');
      this.formattedDate = `${month} ${day} - ${endMonth} ${endDay}, ${year}`;
      this.generateDateHeaders(this.scheduleDate, 3);
    } else if (this.selectedType === 'week') {
      const startDate = new Date(this.scheduleDate);
      const dayOfWeek = startDate.getDay();
      const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
      startDate.setDate(startDate.getDate() + diffToMonday);
      this.scheduleDate = startDate;
      this.endDate = new Date(startDate);
      this.endDate.setDate(startDate.getDate() + 6);
      const startMonth = formatDate(startDate, 'MMMM', 'en-US');
      const endMonth = formatDate(this.endDate, 'MMMM', 'en-US');
      const startDay = formatDate(startDate, 'd', 'en-US');
      const endDay = formatDate(this.endDate, 'd', 'en-US');
      this.formattedDate = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
      this.generateDateHeaders(this.scheduleDate, 7);
    } else if (this.selectedType === 'month') {
      const startDate = new Date(this.scheduleDate.getFullYear(), this.scheduleDate.getMonth(), 1);
      this.scheduleDate = startDate;
      this.endDate = new Date(this.scheduleDate.getFullYear(), this.scheduleDate.getMonth() + 1, 0); // Last day of the month

      this.formattedDate = `${month} ${year}`;
      this.daysInMonth = [];
      this.generateMonthDays();
    }
  }
  generateMonthDays() {
    const startDate = new Date(this.scheduleDate.getFullYear(), this.scheduleDate.getMonth(), 1);
    const endDate = new Date(this.scheduleDate.getFullYear(), this.scheduleDate.getMonth() + 1, 0);
    const firstDayOfWeek = startDate.getDay();
    for (let week = 0; week < firstDayOfWeek; week++) {
      this.daysInMonth.push(null);
    }
    for (let day = 1; day <= endDate.getDate(); day++) {
      this.daysInMonth.push(day);
    }
    this.daysInMonth = this.daysInMonth;
  }
  dateChange(event: any) {
    if (event && event.year && event.month && event.day) {
      this.scheduleCalendarDate = event;
      this.scheduleDate = new Date(event.year, event.month - 1, event.day);
      this.updateFormattedDate();
      this.retrievingData();
    } else {
      console.error('Invalid event object:', event);
    }
  }

  today() {
    this.scheduleDate = new Date();
    this.selectedType = 'day';
    this.updateFormattedDate();
    this.retrievingData();
  }

  nextDate() {
    if (this.selectedType === 'day' || this.selectedType === 'dayTwo') {
      this.scheduleDate.setDate(this.scheduleDate.getDate() + 1);
    } else if (this.selectedType === 'threeDay') {
      this.scheduleDate.setDate(this.scheduleDate.getDate() + 3);
    } else if (this.selectedType === 'week') {
      this.scheduleDate.setDate(this.scheduleDate.getDate() + 7);
    } else if (this.selectedType === 'month') {
      this.scheduleDate.setMonth(this.scheduleDate.getMonth() + 1);
    }
    this.updateFormattedDate();
    if(this.facId || this.spaceId){
    this.retrievingData();
    }
    else if(this.userCalendar){
      this.getUserCalendarDetails();
    }
  }

  previewDate() {
    if (this.selectedType === 'day' || this.selectedType === 'dayTwo') {
      this.scheduleDate.setDate(this.scheduleDate.getDate() - 1);
    } else if (this.selectedType === 'threeDay') {
      this.scheduleDate.setDate(this.scheduleDate.getDate() - 3);
    } else if (this.selectedType === 'week') {
      this.scheduleDate.setDate(this.scheduleDate.getDate() - 7);
    } else if (this.selectedType === 'month') {
      this.scheduleDate.setMonth(this.scheduleDate.getMonth() - 1);
    }
    this.updateFormattedDate();
    if(this.facId || this.spaceId){
    this.retrievingData();
    }
    else if(this.userCalendar){
      this.getUserCalendarDetails();
    }
  }

  retrievingData() {
    if (this.spaceId) {
      this.retrievingScheduleBooking(this.spaceId,this.scheduleDate.toISOString(),
        this.endDate.toISOString(),this.spaceId);
    } else if (this.facId) {
      this.retrievingScheduleBooking(this.facId,this.scheduleDate.toISOString(),
        this.endDate.toISOString(),'');
    }
  }

  filter(type: string) {
    this.selectedType = type;
    this.updateFormattedDate();
  }

  retrievingScheduleBooking(id: string, startDate: string, endDate: string,sid: string) {
    this.bookingService.retrievingScheduleBookingData(id, startDate, endDate,sid).subscribe(
      (response: any) => {
        if(response.status === 200){
          console.log(response.body);
          this.scheduleData = response.body;
        }
        else{
          console.error('Error retrieving schedule booking data:', response);
        }
      }
    );
  }
  getUserCalendarDetails(){
    this.bookingService.retrievingUserCalendarDetails(this.scheduleDate.toISOString(),this.endDate.toISOString())
    .subscribe(
      (response: any) =>{
        if(response.status === 200){
          console.log(response.body);
        }
        else{
          console.error('Error retrieving user calendar details:', response);
        }
      }
    )
  }
}
