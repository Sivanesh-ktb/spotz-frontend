
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Helpers } from '../helpers/helper';
import { FacilityData } from '../models/facility';
import { Observable } from 'rxjs';


@Injectable({
  providedIn:'root'
})

export class FacilityService{

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient,
    private helpers: Helpers,
  ){
  }

  createFacility(orgId:string, facilityData:FacilityData){
    const accessToken = localStorage.getItem('authToken');
    const formData = this.formatFacilityData(orgId,facilityData);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.post(`${this.baseUrl}facilities`, formData,{ headers ,observe: 'response'});
  }
  updateFacilityDetails(orgId:string, facilityId:string, facilityData:FacilityData){
    const accessToken = localStorage.getItem('authToken');
    const formData = this.formatFacilityData(orgId,facilityData);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.put(`${this.baseUrl}facility/${facilityId}`, formData,{ headers ,observe: 'response'});
  }
  updateFacilityOperatingHours(orgId:string, facilityId:string, facilityData:FacilityData){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.put(`${this.baseUrl}facilities/${facilityId}/hours`, facilityData,{ headers ,observe: 'response'});
  }
  formatFacilityData(orgId:string,facilityData:FacilityData){
    let indoor;
    if(facilityData.indoor === 1){
      indoor = 0;
    }
    else if(facilityData.indoor === 2){
      indoor = 1;
    }
    else if(facilityData.indoor === 3){
      indoor = 2;
    }
  const createFacilityData = {
    orgId:orgId,
    name : facilityData.name,
    shortName: this.formatFacilityName(facilityData.name?facilityData.name:''),
    claimed : facilityData.claimed?1:0,
    address : {
      street1 : facilityData.street1,
      street2 : facilityData.street2,
      city : facilityData.city,
      state : facilityData.state,
      zip : facilityData.zip,
      country : this.helpers.country
    },
    amenity : facilityData.amenities,
    description : facilityData.description,
    showAvailability : facilityData.showAvailability,
    abbr : facilityData.abbr,
    href : facilityData.href,
    hours : facilityData.hours,
    indoor : indoor,
  }
  return createFacilityData;
  }
  formatFacilityName (name: string) {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
  getOneFacilityDetails (facilityId:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get(`${this.baseUrl}facility/${facilityId}`,{ headers ,observe: 'response'});
  }
  uploadFacilityBackgroundImage(facId : string, files: FileList,orgId:string,key:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
    });
    const formData: FormData = new FormData();
    formData.append('facId', facId);
    formData.append('orgId', orgId);
    formData.append('key', key);
    Array.from(files).forEach(file => formData.append('files', file, file.name));
    return this.http.post(`${this.baseUrl}upload/fac/image`, formData, { headers , observe : 'response'});
  }
  uploadFacilityMapPdf(facId : string, files: FormData){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
    });
    return this.http.post(`${this.baseUrl}facilities/${facId}/map`, files, { headers , observe : 'response'});
  }
  updateFacilityMap(facId:string,facilityData:FacilityData){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
    });
    return this.http.put(`${this.baseUrl}facilities/${facId}/interactiveMap`, facilityData, { headers , observe : 'response'});
  }
  getPublicCalendar(fid: string, sid:string, start:string, end:string):Observable<any> {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get(`${this.baseUrl}facilities/${fid}/getPublicCalendar?sid=${sid}&start=${start}&end=${end}`,{ headers ,observe: 'response'});
  }
}
