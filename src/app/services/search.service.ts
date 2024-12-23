
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class searchService {
  private baseUrl = environment.baseUrl;
  private searchUrl = `${this.baseUrl}search`;
  constructor(private http: HttpClient) { }

  allOrgAndFacDetails(data: any = {}) {
    let params = new HttpParams();

    Object.keys(data).forEach(key => {
      params = params.append(key, data[key]);
    });

    return this.http.get(this.searchUrl, { params, observe: 'response' });
  }
}
