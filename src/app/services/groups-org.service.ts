import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { CustomGroup } from "../models/groups";

@Injectable({
  providedIn: 'root'
})


export class ManageOrgGroupService{
  public baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient
  )
  {

  }
  storeOrgNewGroup(orgId:string,newGroupDetails: any){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const newGroupDetailsData = this.newGroupDetailsDataFormat(newGroupDetails);
    return this.http.post(`${this.baseUrl}organizations/${orgId}/groups`,newGroupDetailsData,{headers,observe:'response'});
  }
  newGroupDetailsDataFormat(newGroupDetails : any) : CustomGroup{
    return {
      name: newGroupDetails?.name,
      description: newGroupDetails?.description,
      level: newGroupDetails?.level,
      lead: newGroupDetails?.lead,
      discount: newGroupDetails?.discount,
      showAddress: newGroupDetails?.showAddress,
      address:{
        county: newGroupDetails?.county,
        hood: newGroupDetails?.hood,
        street1: newGroupDetails?.street1,
        street2: newGroupDetails?.street2,
        city: newGroupDetails?.city,
        state: newGroupDetails?.state,
        zip: newGroupDetails?.zip
      },
      proof: newGroupDetails?.proof,
      instant: newGroupDetails?.instant,
      taxNum: newGroupDetails?.taxNum,
      priv: newGroupDetails?.priv,
      invoice: newGroupDetails?.invoice?1:0,
      system:0,
      access: newGroupDetails?.access
    }

  }
  retrieveGroupMembersDetails(orgId:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get(`${this.baseUrl}organizations/${orgId}/groups`,{headers,observe:'response'});
  }
  getCustomGroup(orgId:string,userId:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get(`${this.baseUrl}organizations/${orgId}/groups/${userId}`,{headers,observe:'response'});
  }
  updateCustomGroup(orgId:string,groupId:string,groupDetails:any){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const groupDetailsData = this.newGroupDetailsDataFormat(groupDetails);
    return this.http.put(`${this.baseUrl}organizations/${orgId}/groups/${groupId}`,groupDetailsData,{headers,observe:'response'});
  }
  searchMembersDetails(orgId:string,email:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get(`${this.baseUrl}organizations/${orgId}/groups/search/member/${email}`,{headers,observe:'response'});
  }
  removeGroupDetails(orgId:string,groupId:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.delete(`${this.baseUrl}organizations/${orgId}/groups/${groupId}`,{headers,observe:'response'});
  }
  importOrganizationGroup(orgId:string,groupMembers:any){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.post(`${this.baseUrl}organizations/${orgId}/groups/import`,groupMembers,{headers,observe:'response'});
  }
  updateGroupMembers(orgId:string,groupId:string,uid:string,updateMember : any){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.put(`${this.baseUrl}organizations/${orgId}/groups/${groupId}/members/${uid}`, updateMember, { headers, observe: 'response' });
  }
  deleteGroupMembers(orgId:string,groupId:string,uid:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.delete(`${this.baseUrl}organizations/${orgId}/groups/${groupId}/members/${uid}`,{headers,observe:'response'});
  }
}





