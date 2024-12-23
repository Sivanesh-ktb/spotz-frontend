import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Helpers } from '../helpers/helper';
import { regionsData } from '../models/regions';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class createRegion {
    private baseUrl = environment.baseUrl;

    constructor(private http: HttpClient, private helpers: Helpers) {}

    formatAddonsData(regionsDetail: regionsData) {
        const regionData = {
            _id: regionsDetail._id,
            city: regionsDetail.city,
            state: regionsDetail.state,
        };
        return regionData;
    }

    createRegions(regionsDetail: regionsData): Observable<any> {
        const accessToken = localStorage.getItem('authToken');
        const formData = this.formatAddonsData(regionsDetail);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json' // Ensure the content type is set correctly
        });
        return this.http.post(`${this.baseUrl}regions`, formData, { headers, observe: 'response' });
    }

    getAllRegion(): Observable<any> {
        const accessToken = localStorage.getItem('authToken');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`
        });
        return this.http.get(`${this.baseUrl}regions`, { headers, observe: 'response' });
    }

    updateRegion(id: string, regionsDetail: regionsData) {
        const accessToken = localStorage.getItem('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`
        });
        return this.http.put(`${this.baseUrl}regions/${id}`, regionsDetail, { headers, observe: 'response' });
      }
}
