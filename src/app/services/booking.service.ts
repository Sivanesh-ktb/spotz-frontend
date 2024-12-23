import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaymentMethodDTO, PaymentMethodList } from '../models/booking';
import { Observable } from 'rxjs';
import { BookingDTO } from '../utils/cart';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient
  ) { }

  retrievingBookingsData(orgId:string,startDate:string,endDate:string,flatten:boolean,url:string){
    let params = new HttpParams();
    params = params.append('start',startDate.toString());
    params = params.append('end',endDate.toString());
    if(flatten) {
    params = params.append('flatten',flatten);
    }
    const accessToken = localStorage.getItem('authToken');
    const headers = {
      'Authorization':`Bearer ${accessToken}`
    }
    return this.http.get(`${this.baseUrl}${url}/${orgId}/bookings`,{headers,params,observe:'response'});

  }
  getCancelReservationsData(orgId:string,date:string){
    let params = new HttpParams();
    params = params.append('date',date.toString());
    const accessToken = localStorage.getItem('authToken');
    const headers = {
      'Authorization':`Bearer ${accessToken}`
    }
    return this.http.get(`${this.baseUrl}organizations/${orgId}/cancelAll`,{headers,params,observe:'response'});
  }
  retrievingInboxDetails(orgId:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = {
      'Authorization':`Bearer ${accessToken}`
    }
    return this.http.get(`${this.baseUrl}organizations/${orgId}/inbox`,{headers,observe:'response'});
  }
  retrievingScheduleBookingData(id:string,startDate:string,endDate:string,sid:string){
    let params = new HttpParams();
    params = params.append('start',startDate.toString());
    params = params.append('end',endDate.toString());
    if(sid) {
      params = params.append('sid',sid);
    }
    const accessToken = localStorage.getItem('authToken');
    const headers = {
      'Authorization':`Bearer ${accessToken}`
    }
    return this.http.get(`${this.baseUrl}facilities/${id}/schedule`,{headers,params,observe:'response'});
  }
  retrievingAvailabilityData(id:string,startDate:string,endDate:string){
    let params = new HttpParams();
    params = params.append('start',startDate.toString());
    params = params.append('end',endDate.toString());
    const accessToken = localStorage.getItem('authToken');
    const headers = {
      'Authorization':`Bearer ${accessToken}`
    }
    return this.http.get(`${this.baseUrl}spaces/${id}/availability`,{headers,params,observe:'response'});
  }
  getUserBookingDetails(startDate:string,endDate:string){
    let params = new HttpParams();
    params = params.append('end',endDate.toString());
    params = params.append('start',startDate.toString());
    const headers = {
      'Authorization':`Bearer ${localStorage.getItem('authToken')}`
    }
    return this.http.get(`${this.baseUrl}user/bookings`,{headers,params,observe:'response'});
  }
  retrievingUserCalendarDetails(startDate:string,endDate:string){
    let params = new HttpParams();
    params = params.append('end',endDate.toString());
    params = params.append('start',startDate.toString());
    const headers = {
      'Authorization':`Bearer ${localStorage.getItem('authToken')}`
    }
    return this.http.get(`${this.baseUrl}user/calendar`,{headers,params,observe:'response'});
  }
  retrieveFacSpaceDetails(id : string) {
    return this.http.get(`${this.baseUrl}facilities/${id}/spaces`,{observe:'response'});
  }
  createPaymentMethod(data: PaymentMethodDTO) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
  
    return this.http.post(`${this.baseUrl}booking/createResource`, data, { headers });
  }  

  getAllPaymentMethods() :Observable<PaymentMethodList[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.get<PaymentMethodList[]>(`${this.baseUrl}user/payments`, { headers });
  }
  bookings(data: BookingDTO) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.post(`${this.baseUrl}/bookings`, data, { headers, observe: 'response' });
  }
}
