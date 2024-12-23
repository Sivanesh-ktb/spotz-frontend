import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {
  private baseUrl = environment.baseUrl;
  constructor(

    private http: HttpClient
  ) { }


  getOrgWorkOrders(orgId: string, startDate: string, endDate: string) {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    let params = new HttpParams();
    params = params.append('startDate', startDate);
    params = params.append('endDate', endDate);
    return this.http.get(`${this.baseUrl}organizations/${orgId}/workorders`, { headers, params, observe: 'response' });
  }
}
