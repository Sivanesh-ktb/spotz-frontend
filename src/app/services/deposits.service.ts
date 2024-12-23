import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepositsService {

  private baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient
  ) { }

  getOrgDepositsDetails(orgId:string,startDate:string,endDate:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
       'Authorization' : `Bearer ${accessToken}`
    });
    let params = new HttpParams();
    params = params.append('startDate',startDate);
    params = params.append('endDate',endDate);
    return this.http.get(`${this.baseUrl}finance/${orgId}/deposits`,{headers,params,observe:'response'});
  }
  createOrganizationDeposit(orgId:string,depositData:any){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${accessToken}`
    })
    return this.http.post(`${this.baseUrl}organizations/${orgId}/deposits`,depositData,{headers,observe:'response'});
  }
  updateOrganizationDeposit(orgId:string,depositId:string,depositData:any){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${accessToken}`
    })
    return this.http.put(`${this.baseUrl}organizations/${orgId}/deposits/${depositId}`,depositData,{headers,observe:'response'});
  }
  deleteOrganizationDeposit(orgId:string,depositId:string,depositData:any){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${accessToken}`
    })
    return this.http.delete(`${this.baseUrl}organizations/${orgId}/deposits/${depositId}`,{headers,observe:'response'});
  }
}
