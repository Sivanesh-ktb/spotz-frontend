import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {

  private baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient
  ) { }


  getIncidentsData(){
    const accessToken = localStorage.getItem('authToken');
    const headers = {
      'Authorization':`Bearer ${accessToken}`
    }
    return this.http.get(`${this.baseUrl}admin/getAllIncidents`,{headers,observe:'response'});
  }
}
