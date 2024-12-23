import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
private baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient,

  ) { }

  retrievingOrgInvoices(orgId:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = {
      'Authorization':`Bearer ${accessToken}`
    }
    return this.http.get(`${this.baseUrl}finance/${orgId}/invoices`,{headers,observe:'response'});
  }
  getPendingInvoices(orgId:string,startDate:string,endDate:string){
    let params = new HttpParams();
    params = params.append('startDate',startDate);
    params = params.append('endDate',endDate);
    const accessToken = localStorage.getItem('authToken');
    const headers = {
      'Authorization':`Bearer ${accessToken}`
    }
    return  this.http.get(`${this.baseUrl}finance/${orgId}/invoices/pending`,{headers,params,observe:'response'});
  }
  getOrgGroupReport(orgId:string,startDate:string,endDate:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = {
      'Authorization':`Bearer ${accessToken}`
    }
    let params = new HttpParams();
    params = params.append('startDate',startDate);
    params = params.append('endDate', endDate);
    return this.http.get(`${this.baseUrl}finance/${orgId}/groups`,{headers,params,observe:'response'});
  }
  retrievingInvoiceDetails(){
    const accessToken = localStorage.getItem('authToken');
    const headers = {
      'Authorization':`Bearer ${accessToken}`
    }
    return this.http.get(`${this.baseUrl}user/invoices`,{headers,observe:'response'});
  }
}
