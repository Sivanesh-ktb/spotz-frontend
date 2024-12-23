import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  public baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient
  ) { }

  getOrganizationDetails(orgName:string){
    return this.http.get(`${this.baseUrl}public/organizations/${orgName}`,{observe:'response'});
  }
 getOrganizationFacilities(orgId:string){
  return this.http.get(`${this.baseUrl}public/organizations/${orgId}/facilities`,{observe:'response'});
 }
 retrieveFacilityDetails(orgName:string,facName:string,city:string,state:string){
  return this.http.get(`${this.baseUrl}public/${state}/${city}/organizations/${orgName}/facilities/${facName}`,{observe:'response'});
 }
 retrieveSpaceDetails(facId:string){
  return this.http.get(`${this.baseUrl}facilities/${facId}/spaces`,{observe:'response'});
 }
  getSpaceDetails(spaceId:string){
    return this.http.get(`${this.baseUrl}public/spaces/${spaceId}`,{observe:'response'});
  }
  getOrgSpaceImages(orgId:string){
    return this.http.get(`${this.baseUrl}public/organizations/${orgId}/spaces/images`,{observe:'response'});
  }
  getFacilitySpaceDetails(orgId:string, facId?: string){
    const url = facId
    ? `${this.baseUrl}public/organizations/${orgId}/getOrgFacSpaceDetails/${facId}`
    : `${this.baseUrl}public/organizations/${orgId}/getOrgFacSpaceDetails`;
    return this.http.get(url, { observe: 'response' });
  }
}
