import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Filter, SpaceDTO } from '../models/space';
import { BookingSpaceDTO } from '../models/search';
import { CartDTO } from '../utils/cart';
import { BookingDoneDTO } from '../models/booking';
import { BookingInboxDTO } from '../models/org';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
    private selectedSpaceSource = new BehaviorSubject<any>(null);
    selectedSpace$ = this.selectedSpaceSource.asObservable();
    private eventDateSource = new BehaviorSubject<Date | null>(null);
    eventDate$ = this.eventDateSource.asObservable();
    private filterValues = new BehaviorSubject<any>(null);
    filterValues$ = this.filterValues.asObservable();
    private recurringSource = new BehaviorSubject<boolean>(false);
    recurringSource$ = this.recurringSource.asObservable();

    private spaceDetails = new BehaviorSubject<any>(null);
    spaceDetails$ = this.spaceDetails.asObservable();
    private facilityDetails = new BehaviorSubject<any>(null);
    facilityDetails$ = this.facilityDetails.asObservable();
    private spaceAvailableDetails = new BehaviorSubject<any>(null);
    spaceAvailableDetails$ = this.spaceAvailableDetails.asObservable();
    private selectedFacName = new BehaviorSubject<string>('');
    selectedFacName$ = this.selectedFacName.asObservable();
    private selectedOrgName = new BehaviorSubject<string>('');
    selectedOrgName$ = this.selectedOrgName.asObservable();
    private setAvailability = new BehaviorSubject<boolean>(false);
    setAvailability$ = this.setAvailability.asObservable();
    private infoButtonStatus = new BehaviorSubject<boolean>(false);
    infoButtonStatus$ = this.infoButtonStatus.asObservable();
    private showScore = new BehaviorSubject<boolean>(false);
    setShowScore$ = this.showScore.asObservable();
    private userOrgDetails = new BehaviorSubject<any>(null);
    userOrgDetails$ = this.userOrgDetails.asObservable();
    private cartDetails = new BehaviorSubject<any>(null);
    cartDetails$ = this.cartDetails.asObservable();
    private isSingleDay = new BehaviorSubject<boolean>(false);
    isSingleDay$ = this.isSingleDay.asObservable();
    private searchSpaceDetails = new BehaviorSubject<boolean>(false);
    searchSpaceDetails$ = this.searchSpaceDetails.asObservable();
    private bookingPageStatus = new BehaviorSubject<number>(0);
    bookingPageStatus$ = this.bookingPageStatus.asObservable();
    private SpaceSettingTabStatus = new BehaviorSubject<boolean>(true);
    SpaceSettingTabStatus$ = this.SpaceSettingTabStatus.asObservable();
    private setBooking = new BehaviorSubject<BookingDoneDTO | null>(null);
    setBooking$ = this.setBooking.asObservable();
    private infoPageStatus = new BehaviorSubject<boolean>(false);
    infoPageStatus$ = this.infoPageStatus.asObservable();
    private searchFacLoader = new BehaviorSubject<boolean>(false);
    searchFacLoader$ = this.searchFacLoader.asObservable();
    private bookingApprovalDetails = new BehaviorSubject<BookingInboxDTO | null>(null);
    bookingApprovalDetails$ = this.bookingApprovalDetails.asObservable();
convertTo24HourFormat(time: string): number {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }
    return ((hours * 60) + minutes)/5;
}
convertToNormalHourFormat(time: number): string {
  const totalMinutes = time * 5;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let modifier = 'AM';
  if (hours >= 12) {
      modifier = 'PM';
  }
  let hours12 = hours % 12;
  if (hours12 === 0) {
      hours12 = 12;
  }
  const formattedTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${modifier}`;
  return formattedTime;
}
timeDifference(start: number, end: number): number {
  const startTime = start * 5;
  const endTime = end * 5;
  const difference = (endTime - startTime) / 60;
  return parseFloat(difference.toFixed(1));
}

normalTimeFormatChange(time:number):string{
	  if (isNaN(time) || time < 0 || time > 23) {
	    return 'Invalid Time';
	}
	let hours = time;
	const minutes = '00';
	let ampm = 'AM';
	if (hours >= 12) {
	    if (hours > 12) {
	        hours -= 12;
	    }
	    ampm = 'PM';
	} else if (hours === 0) {
	    hours = 12;
	}
	const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
	const formattedMinutes = minutes;
	return `${formattedHours}:${formattedMinutes} ${ampm}`;
	}

  removeEmptySpaces(value:string):string{
    return value.replace(/\s+/g, '-');
  }
  getFormattedDate(date:Date ) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  setSelectedSpace(space: SpaceDTO) {
    this.selectedSpaceSource.next(space);
  }

  setEventDate(date: Date) {
    this.eventDateSource.next(date);
  }
  getEventDate() : Date | null {
    return this.eventDateSource.value;
  }
  resetEventDate() {
    this.eventDateSource.next(this.eventDateSource.value);
  }
  setFilterValues(filter:Filter){
   this.filterValues.next(filter);
  }
  getFilterValues():Filter{
    return this.filterValues.value;
  }
  setRecurring(toggle: boolean) {
    this.recurringSource.next(toggle);
  }
  removeSearchData(){
    this.filterValues.next(null);
    this.recurringSource.next(false);
  }
  setSpaceDetails(space: SpaceDTO){
    this.spaceDetails.next(space);
  }
  setFacilityDetails(facility:SpaceDTO[]){
    this.facilityDetails.next(facility);
  }
  setSpaceAvailableDetails(space:BookingSpaceDTO){
    this.spaceAvailableDetails.next(space);
  }
  setSelectedFacName(facName:string){
    this.selectedFacName.next(facName);
  }
  setSelectedOrgName(orgName:string){
    this.selectedOrgName.next(orgName);
  }
  setAvailabilityStatus(status:boolean){
    this.setAvailability.next(status);
  }
  setInfoButtonStatus(status:boolean){
    this.infoButtonStatus.next(status);
  }
  setShowScoreValue(status:boolean){
    this.showScore.next(status);
  }
  getshowScore() {
    return this.showScore.value;
  }
  userOrganizationsDetails(orgDetails:any){
    this.userOrgDetails.next(orgDetails);
  }
    storeCartDetails(booking: CartDTO){
    this.cartDetails.next(booking);
  }
  clearCartDetails(){
    this.cartDetails.next(null);
  }
  getCartDetails(){
    return this.cartDetails.value;
  }
  setFetchDates(status:boolean){
    this.isSingleDay.next(status);
  }
  callSearchApi(status:boolean){
    this.searchSpaceDetails.next(status);
  }
  setBookingPageStatus(status:number){
    this.bookingPageStatus.next(status);
  }
  setSpaceSettingTabStatus(status:boolean){
    this.SpaceSettingTabStatus.next(status);
  }
    setBookingId(bookingId:BookingDoneDTO){
    this.setBooking.next(bookingId);
  }
  setDisableInfoPage(status:boolean){
    this.infoPageStatus.next(status);
  }
  setLoaderResponse(status:boolean){
    this.searchFacLoader.next(status);
  }
  setBookingApprovalDetails(data:BookingInboxDTO){
    this.bookingApprovalDetails.next(data);
  }
}
