
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Deposit, SpaceData } from "../models/space";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})

export class SpaceService{
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient){

  }
  createSpace(orgId:string, facilityId:string, spaceData:SpaceData){
    const accessToken = localStorage.getItem('authToken');
    const formData = this.formatSpaceData(spaceData);
    const params = new HttpParams()
        .set('orgId', orgId)
        .set('facId', facilityId);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.post(`${this.baseUrl}spaces`, formData,{ headers,params ,observe: 'response'});
  }
  formatSpaceData(spaceData:SpaceData){
    const spaceValues = {
      name : spaceData.name,
      price: typeof spaceData.price === 'string' ? spaceData.price.replace(/,/g, '') : spaceData.price,
      dimension : {
        o : {
          m : spaceData.m,
          v : spaceData.l
        },
        a : {
          m : spaceData.m,
          v : spaceData.w
        },
        l : {
          m : spaceData.m,
          v : spaceData.l
        },
        w : {
          m : spaceData.m,
          v : spaceData.w
        }
      },
      base : spaceData.base,
      number : spaceData.number,
      suffix : spaceData.suffix,
      ageGroup : spaceData.ageGroup,
      surface : spaceData.surface,
      indoor : spaceData.indoor,
      tagline : spaceData.tagline,
      summary : spaceData.summary,
      letter : spaceData.letter,
      rentaltypes : spaceData.rentaltypes,
      IsRefundable : spaceData.IsRefundable?true:false,
      childId : spaceData.childId,
      nonRental : spaceData.nonRental,
      hourly : spaceData.hourly?true:false,
      pricing : spaceData.pricing,
      deposits : spaceData.deposits,
      assets : spaceData.assets,
      notify : spaceData.notify?true:false,
      eventName : spaceData.eventName?true:false,
      rental: {
        buffer: [
          {
            before:  spaceData?.rental?.buffer[0]?.before,
            after: spaceData?.rental?.buffer[0]?.after
          }
        ],
        block: spaceData?.rental?.block
      },
      instantBooking : spaceData.instantBooking?true:false,
      sports : spaceData.sports,
      typ : spaceData.typ,
      capacity : spaceData.capacity,
      addons : spaceData.addons,
      amenity : spaceData.amenity,
      parentId: spaceData.parentId,
  }
  return spaceValues;
}
getSpaceDetails(spaceId:string){
  const accessToken = localStorage.getItem('authToken');
       const headers = new HttpHeaders({
        'Authorization' : `Bearer ${accessToken}`
       });
       return this.http.get(`${this.baseUrl}spaces/${spaceId}`,{headers,observe:'response'});
}
updateSpaceDetails(spaceId:string, spaceData:SpaceData){
  const accessToken = localStorage.getItem('authToken');
  const formData = this.formatSpaceData(spaceData);
  const headers = new HttpHeaders({
    'Authorization' : `Bearer ${accessToken}`
  });
  return this.http.put(`${this.baseUrl}spaces/${spaceId}`,formData,{headers,observe:'response'});
}
createSpaceDeposit(spaceId:string, depositData:Deposit[]){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders
  ({
    'Authorization': `Bearer ${accessToken}`
  });
  return this.http.post(`${this.baseUrl}spaces/${spaceId}/deposits`,depositData,{headers,observe:'response'});
}
spaceDetailsUpdateDeposit(spaceId:string, depositData:Deposit[],depositId : string){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders
  ({
    'Authorization': `Bearer ${accessToken}`
  });
  return this.http.put(`${this.baseUrl}spaces/${spaceId}/deposits/${depositId}`,depositData,{headers,observe:'response'});
}
spaceDepositDetailsDelete(spaceId:string, depositId:string){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders
  ({
    'Authorization': `Bearer ${accessToken}`
  });
  return this.http.delete(`${this.baseUrl}spaces/${spaceId}/deposits/${depositId}`,{headers,observe:'response'});
}
uploadSpaceImages(spaceId: string, formData: FormData){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${accessToken}`
  });

  return this.http.post(`${this.baseUrl}spaces/${spaceId}/photos`, formData, { headers, observe: 'response' });
}
deleteSpaceImages(spaceId : string, imageIds: string[]){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
  });
  const body = { keys: imageIds }; // Wrap the keys array in an object
  return this.http.delete(`${this.baseUrl}spaces/${spaceId}/photos` ,{body: body,headers,observe:'response'});
}

duplicateSpace(spaceId:string){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders
  ({
    'Authorization': `Bearer ${accessToken}`
  });
  return this.http.post(`${this.baseUrl}space/${spaceId}`,{},{headers,observe:'response'});
}
addAvailability(orgId:string,availabilityData:any){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders
  ({
    'Authorization': `Bearer ${accessToken}`
  });
  return this.http.put(`${this.baseUrl}organizations/${orgId}/availability/getCollisions`,availabilityData,{headers,observe:'response'});
}
createSpaceAvailability(orgId:string,availabilityData:any){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders
  ({
    'Authorization': `Bearer ${accessToken}`
  });
  return this.http.post(`${this.baseUrl}organizations/${orgId}/availability`,availabilityData,{headers,observe:'response'});
}
updateAvailabilityRuleData(orgId:string,userId:string,availabilityData:any){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders
  ({
    'Authorization': `Bearer ${accessToken}`
  });
  return this.http.put(`${this.baseUrl}organizations/${orgId}/availability/${userId}`,availabilityData,{headers,observe:'response'});
}
deleteSpaceAvailability(orgId:string,ruleId:string){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${accessToken}`
  });
  return this.http.delete(`${this.baseUrl}organizations/${orgId}/availability/${ruleId}`,{headers,observe:'response'});
}
getReservationPrintDetails(reservationId:string){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${accessToken}`
  });
  return this.http.get(`${this.baseUrl}/reservations/print/${reservationId}`,{headers,observe:'response'});
}
}

