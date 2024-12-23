
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import{ Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchOrgFacService {
  private baseUrl = environment.baseUrl;
  private searchOrgFacUrl = `${this.baseUrl}search/org/fac`;
  constructor(private http: HttpClient){
  }
  searchOrgFacDetails(value: string, guest: string) {
    const params = new HttpParams()
      .set('query', value)
      .set('guest', guest);

    return this.http.get<any>(this.searchOrgFacUrl, { params });
  }
  getOrganizationDetails(orgName : string){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
     'Authorization' : `Bearer ${accessToken}`
    });
    const params = new HttpParams()
    .set('query', orgName);
    return this.http.get(`${this.baseUrl}search/organizations`,{headers,params,observe: 'response'});
  }
}


