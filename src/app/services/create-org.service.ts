import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Helpers } from '../helpers/helper';
import { OrgDetails, SpaceDetailsDTO } from '../models/org';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateOrgComponentService {
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient,
    private helpers: Helpers,
  ) {
  }
  createOrg(orgData: OrgDetails) {
    const userId = localStorage.getItem('id') ?? '';
    const accessToken = localStorage.getItem('authToken');
   const formData = this.formatOrgData(userId,orgData);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.post(`${this.baseUrl}organizations`, formData,{ headers });
  }
formatOrgData(userId: string,orgData: OrgDetails) {
  const createOrgData = {
    userId: userId,
    name: orgData.name,
    cat: orgData.cat,
    gdUrl: `${orgData.state}/${orgData.city}/org/,${orgData.name}`,
    shortName : this.formatOrganizationName(orgData.name?orgData.name:''),
    url: orgData.url?orgData.url:'',
    noGuest: 4,
    address: {
      street1: orgData.street1,
      street2: orgData.street2,
      city: orgData.city,
      state: orgData.state,
      zip: orgData.zip,
      country: this.helpers.country
    },
    social:{
      twitter: orgData.twitter?this.helpers.twitter+'/'+orgData.twitter:'',
      facebook: orgData.facebook?this.helpers.facebook+'/'+orgData.facebook:'',
      instagram: orgData.instagram?this.helpers.instagram+'/'+orgData.instagram:'',
    },
    monthly: orgData.monthly,
    terms: {
      host: {
        group: orgData.group?orgData.group:0,
        nonGroup: orgData.nonGroup?orgData.nonGroup:0,
      },
      tx: orgData.tx?orgData.tx:0,
      user: orgData.user?orgData.user:0,
    },
    claimed: orgData.claimed?1:0,
    paying: orgData.paying?1:0,
    featured: orgData.featured?1:0,
    active: orgData.active?1:0,
  };
  return createOrgData;
}
formatOrganizationName (name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}
  retrieveOrgDetails(orgId: string)  {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get(`${this.baseUrl}organizations/${orgId}`,{headers, observe: 'response'});
  }

  updateOrgDetails(orgId: string, orgData: OrgDetails){
    const userId = localStorage.getItem('id') ?? '';
    const accessToken = localStorage.getItem('authToken');
    const formData = this.formatOrgData(userId,orgData);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
return this.http.put(`${this.baseUrl}organizations/${orgId}`, formData,{headers,observe:'response'});
}
spaceDropdownDetails(orgId: string): Observable<HttpResponse<SpaceDetailsDTO>>{
  const params = new HttpParams().set('organizationId', orgId);
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization' : `Bearer ${accessToken}`
  });
  return this.http.get<SpaceDetailsDTO>(`${this.baseUrl}widget/org/`, {
    headers,
    params,
    observe: 'response',
  });
}
getOrgbyId(orgName: string, city: string, orgId: string) {
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${accessToken}`
  });
  const body = { shortName: orgName, city: city , orgId: orgId};
  return this.http.post(`${this.baseUrl}organization/validation`, body, { headers, observe:'response'});
}
getOrgFacilities(orgId:string){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization':`Bearer ${accessToken}`
  });
  return this.http.get(`${this.baseUrl}org/${orgId}/facilities`,{headers,observe:'response'});
}
updateOrganizationDetails(orgId: string, orgData: OrgDetails){

  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${accessToken}`
  });
return this.http.put(`${this.baseUrl}organizations/${orgId}`, orgData,{headers,observe:'response'});

}
retrieveOrgSpaceDetails(id : string,url:string) {
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${accessToken}`
  });
  return this.http.get(`${this.baseUrl}${url}/${id}/spaces`,{headers,observe:'response'});
}
modifyOrgDetails(orgId:string,orgData:any){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization':`Bearer ${accessToken}`
  });
  return this.http.put(`${this.baseUrl}organizations/${orgId}`,orgData,{headers,observe:'response'});
}
checkRoutingNumber(routingNumber:number){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization':`Bearer ${accessToken}`
  });
  const params = new HttpParams().set('number',routingNumber);
  return this.http.get(`${this.baseUrl}aba`,{params,headers,observe:'response'});
}
}
