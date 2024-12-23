import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CalendarOptions, DatesSetArg, EventClickArg, ViewMountArg} from '@fullcalendar/core';
import { CalData, Event, SpaceData, SpaceDTO } from 'src/app/models/space';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDatepicker } from '@angular/material/datepicker';
import moment from 'moment';
import { FacilityService } from 'src/app/services/facility.service';
import { Observable } from 'rxjs';
import { AvailabilityDTO } from 'src/app/models/search';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { AppConst } from 'src/app/app.const';
import { BookingDTO, CartDTO, CartUtils } from 'src/app/utils/cart';
import { BookingPopupComponent } from '../../booking-popup/booking-popup';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

interface CalendarInfo {
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-space-availability',
  templateUrl: './space-availability.html',
  styleUrls: ['./space-availability.css'],
})
export class SpaceAvailabilityComponent implements OnInit, AfterViewInit {
  @ViewChild('datepicker') datepicker!: MatDatepicker<Date>;
  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;
  @Input() spaceDetails!: SpaceDTO;
  spaceCalendar = false;
  calendarOptions!: CalendarOptions;
  eventDateRange = {
    earliest: moment(),
    latest: moment().add(1, 'month'),
  };

  calData: CalData = {
    fid: null,
    sid: null,
    public: true,
    events: [],
    map: new Map(),
    resources: [],
    nextDate: null,
    spaces: {} as SpaceData,
    calendars: [] as AvailabilityDTO[],
    bookings: [] as BookingDTO[],
  };

  calendar: any;
  singleSpace = false;
  showAv = false;
  showBookings = false;
  header: any = {};
  DEFAULT_RESOURCE_THRESHOLD: number = this.appConst.DEFAULT_RESOURCE_THRESHOLD;
  previousView = '';
  currentView = '';
  dateString = this.appConst.dateString;
  cart!: CartDTO;
  constructor(
    public facilityService: FacilityService,
    public appConst: AppConst,
    public dialog: MatDialog,
    public commonService: CommonService,
    public cartService: CartUtils
  ) {}

  ngOnInit(): void {
    this.initializeCalendarOptions();
    this.calData.fid = this.spaceDetails.fac?._id || null;
    this.calData.sid = this.spaceDetails._id || null;
    this.commonService.cartDetails$.subscribe((data) => {
      if (data) {
        this.cart = data;
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeFullCalendar();
  } 

  private initializeCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'today myCustomButton prev,next',
        right: this.appConst.calendarHeaderToolBar,
      },
      customButtons: {
        myCustomButton: {
          text: '', // Placeholder
          click: () => {
            this.openDatePicker();
          },
        }
      },
      views: {
        timeGridThreeDay: {
          type: 'timeGrid',
          duration: { days: 3 },
          buttonText: '3 Days',
          allDaySlot: false,
        },
        timeGridWeek: { allDaySlot: false },
        dayGridMonth: { allDaySlot: false },
        timeGridDay: { allDaySlot: false },
      },
      scrollTime: this.appConst.startTime,
      events: this.eventsCallback.bind(this),
      eventClick: this.onEventClick.bind(this),
      viewDidMount: function () {
        const button = document.querySelector('.fc-myCustomButton-button');
        if (button) {
          button.innerHTML = '<i class="fa fa-calendar"></i>'; // Add Font Awesome icon
        }
      },
      datesSet: this.onDatesSet.bind(this),
    };
  }

  private initializeFullCalendar(): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.render();
  }

  openDatePicker(): void {
    if (this.datepicker) {
      this.datepicker.open();
    } else {
      console.error('Datepicker is not available');
    }
  }
  onDateChange(event:MatDatepickerInputEvent<Date>): void {
    const selectedDate: Date = event.value!;
     this.onDateSelected(selectedDate);
  }
  onDateSelected(date: Date): void {
    const calendarApi = this.calendarComponent.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(date);
    }
  }

  setVerticalDayView() {
    this.calendar.fullCalendar('option', {
      buttonText: { agendaDay: 'Day' },
      header: this.header,
    });
  }

  setTimelineView() {
    this.calendar.fullCalendar('changeView', 'timelineDay');
  }

  setEventDateRange(start: string, end: string) {
    this.eventDateRange.earliest = moment(start).utc().startOf('day').add(1, 'day');
    this.eventDateRange.latest = moment(end).utc().startOf('day').add(1, 'day');
  }
  onDatesSet(dateInfo: DatesSetArg): void {
    const startDate = dateInfo.startStr;
    const endDate = dateInfo.endStr;
    const formattedStartDate = startDate.split('T')[0];
    const formattedEndDate = endDate.split('T')[0];
    this.fetchMoreEvents(formattedStartDate, formattedEndDate);
  }
  eventsCallback(info: CalendarInfo, successCallback: Function): void {
    const start = moment(info.start);
    const end = moment(info.end);
    if (this.eventDateRange.earliest && this.eventDateRange.latest) {
      const startDiff = this.eventDateRange.earliest.diff(start);
      const endDiff = this.eventDateRange.latest.diff(end);
      end.add(1, 'day');

      if (startDiff > 0) {
        this.fetchMoreEvents(start.format(this.dateString), end.format(this.dateString));
        this.eventDateRange.earliest = start;
      }
      if (endDiff < 0) {
        this.fetchMoreEvents(this.eventDateRange.latest.format(this.dateString), end.format(this.dateString));
        this.eventDateRange.latest = end;
      }
      if (startDiff <= 0 && endDiff >= 0) {
        successCallback(this.calData.events);
        return;
      }
    }
    successCallback([]);
  }

  fetchMoreEvents(start: string, end: string): void {
    let fetchEvents$: Observable<Event> = new Observable();
    if (this.calData.public) {
      if (this.calData.sid === null) {
        fetchEvents$ = this.facilityService.getPublicCalendar(this.calData.fid || '', "", start, end);
      } else {
        fetchEvents$ = this.facilityService.getPublicCalendar(this.calData.fid || '', this.calData.sid, start, end);
      }
    }
    fetchEvents$.subscribe({
      next: (newCalData: any) => {
        this.addEvents(newCalData.body);
      },
      error: (err: any) => console.error('Error fetching events:', err)
    });
  }

  addEvents(newCalData: CalData): void {
    let addList: Event[] = [];
    this.calendarOptions.events = [...newCalData.events];
    this.calData.nextDate = newCalData.nextDate || null;
    this.calData.spaces = newCalData.spaces;
    this.calData.events = [...this.calData.events, ...newCalData.events];
    this.calData.calendars = [...this.calData.calendars, ...newCalData.calendars];
    this.calData.bookings = [...this.calData.bookings, ...newCalData.bookings];
    this.calData.spaces = newCalData.spaces;
    if (!this.calData.fid) {
      addList = newCalData.events;
    } else {
      Object.entries(newCalData.map).forEach(([resourceId, newEvents]: [string, Event[]]) => {
        const resource = this.calData.resources.find((res: any) => res.id === resourceId);

          if (resource?.selected) {
            const currentEvents = this.calData.map.get(resourceId) ?? [];

          const updatedEvents = [...currentEvents, ...newEvents];
          this.calData.map.set(resourceId, updatedEvents);
          const filteredList = newEvents.filter((event: Event) => this.isEventAllowed(event));

          addList = [...addList, ...filteredList];
        } else {
          const currentEvents = this.calData.map.get(resourceId) ?? [];
          this.calData.map.set(resourceId, [...currentEvents, ...newEvents]);
        }
      });

    }

    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();

      calendarApi.addEventSource(this.calData.events);
      calendarApi.render();
    } else {
      console.error('FullCalendar component is not available.');
    }
  }

  isEventAllowed(event: Event) {
    return (this.showAv && event.className.includes('av-rule')) ||
      (this.showBookings && event.className.includes('booking'));
  }

  onEventClick(arg: EventClickArg): void {
    const clickedEvent = arg.event;
    const jsEvent = arg.jsEvent;
    const view = arg.view;
    if (!clickedEvent.classNames.includes('clickable')) {
      console.warn('Event is not clickable.');
      return;
    }
    if (clickedEvent.classNames.includes('booking')) {
      if (!this.calData.public) {
        this.viewBooking(clickedEvent.id);
      }
    } else if (clickedEvent.classNames.includes('av-rule')) {
      if (this.calData.public) {
        if (clickedEvent.start) {
          this.openBookingModal(clickedEvent.id, clickedEvent.start);
        } else {
          console.error('Event start date is null.');
        }
      } else {
        console.log(
          'Blocks associated with this calendar are not implemented yet.'
        );
      }
    }
    const popovers = document.querySelectorAll('.popover');
    popovers.forEach((popover) => popover.classList.remove('show'));
  }

  viewBooking(bookingId: string): void {
    const booking = this.calData.bookings.find(
      (bookingData: BookingDTO) => bookingData['_id'] === bookingId
    );
    if (!booking) {
      console.error('Booking not found');
      return;
    }

    this.dialog.open(BookingPopupComponent, {
      data: { ...booking, action: 'View' },
      width: '800px',
      disableClose: true,
    });
  }

  openBookingModal(eventId: string,date:Date): void {
    const calendarId = eventId.split('_')[0];
    const calendar = this.calData.calendars.find(
      (calendarData:AvailabilityDTO) => calendarData['_id'] === calendarId
    );
    if (!calendar) {
      console.error(`Calendar not found for event with ID: ${calendarId}`);
      return;
    }
    if(this.cart && this.cart.booking && this.cart.booking.children){
      this.cart.booking.children = [];
      this.cart.error.days = [];
      this.commonService.storeCartDetails(this.cart);
      this.cartService.cancel(this.cart);
      this.cartService.processBooking.calculate();
      }
    this.commonService.callSearchApi(true);
    this.commonService.setDisableInfoPage(true);
    this.commonService.setBookingPageStatus(this.appConst.bookingSchedule);
    this.commonService.setEventDate(date);
    this.commonService.setSelectedSpace(Object.values(this.calData.spaces)[0]);
    const dialogRef = this.dialog.open(BookingPopupComponent, {
      width: '100%',
      maxWidth: '95vw',
      position: { top: '20px' },
      data: { row: Object.values(this.calData.spaces)[0] },
    });
    dialogRef.afterClosed().subscribe((result: { refresh: boolean }) => {
      if (result?.refresh) {
        console.log('Calendar refreshed.');
      }
    });
  }

  onViewRender(arg: ViewMountArg): void {
    const viewName = arg.view.type;
    if (viewName === this.currentView) {
      return;
    }
    this.previousView = this.currentView;
    this.currentView = viewName;
    if (this.calData) {
      this.setCalendarContent();
      if (viewName === 'dayGridMonth') {
        this.showAv = false;
        this.toggleAvailability(false);
      } else if (this.previousView === 'dayGridMonth') {
        this.showAv = true;
        this.toggleAvailability(true);
      }
    }
  }

  setCalendarContent(): void {
    let height = 31;
    if (this.currentView === 'timelineDay') {
      const resourceOffset = 37;
      this.calData.resources.forEach((resource) => {
        if (resource.selected) {
          height += resourceOffset;
        }
      });
    } else {
      height = this.appConst.DEFAULT_HEIGHT;
    }
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.setOption('contentHeight', height);
  }

  toggleAvailability(show: boolean): void {
    this.showAv = show;
    if (show) {
      const eventList = this.getActiveEvents('av-rule');
      this.addAllowedEvents(eventList);
    } else {
      const eventList = this.getActiveEvents('av-rule');
      this.removeDisallowedEvents(eventList);
    }
  }

  getActiveEvents(type: string): any[] {
    return this.calData.events.filter((event) => event.title.includes(type));
  }

  addAllowedEvents(events: Event[]): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.addEventSource(events);
    calendarApi.render();
  }

  removeDisallowedEvents(events: Event[]): void {
    const calendarApi = this.calendarComponent.getApi();
    const allowedEvents = events.filter(event => this.isEventAllowed(event));
    const allowedEventIds = allowedEvents.map(event => event.id);
    events.forEach(event => {
      if (!allowedEventIds.includes(event.id)) {
        calendarApi.getEventById(event.id)?.remove();
      }
    });
    calendarApi.render();
  }

}
