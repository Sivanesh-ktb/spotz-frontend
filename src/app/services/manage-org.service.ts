
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { addContact } from "../models/org";
import { OrgFeaturedSpaceDetailsDto } from "../models/search";

@Injectable({
  providedIn: 'root',
})
export class ManageOrgService {
  public baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}
  getViewOrgDetails(orgId: string) {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    const params = new HttpParams().set('orgId', orgId);
    return this.http.get(`${this.baseUrl}retrieving/org/view/details`, {
      headers,
      params,
      observe: 'response',
    });
  }
  uploadOrgBackgroundImage(
    orgId: string,
    type: number,
    files: FileList,
    key: string
  ) {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    const formData: FormData = new FormData();
    formData.append('orgId', orgId);
    formData.append('key', key);
    formData.append('type', type.toString());
    Array.from(files).forEach((file) =>
      formData.append('files', file, file.name)
    );
    return this.http.post(`${this.baseUrl}upload/org/image`, formData, {
      headers,
    });
  }
  getOrgGroupsDetails(orgId: string) {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.post(
      `${this.baseUrl}retrieving/org/groups`,
      { orgId },
      { headers, observe: 'response' }
    );
  }
  getIndividualMemberDetails(orgId: string, groupId: string) {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.post(
      `${this.baseUrl}retrieving/org/groups/members`,
      { orgId, groupId },
      { headers, observe: 'response' }
    );
  }
  inviteMember(email: string, orgId: string, groupId: string) {
    const accessToken = localStorage.getItem('authToken');
    const invited = true;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.post(
      `${this.baseUrl}organizations/${orgId}/groups/${groupId}/memberships`,
      { email, invited },
      { headers, observe: 'response' }
    );
  }
  getIndividualUserDetails(id: string) {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(`${this.baseUrl}user/${id}`, {
      headers,
      observe: 'response',
    });
  }
  updateOrgContactDetails(orgId: string, contacts: addContact[]) {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.put(
      `${this.baseUrl}organizations/${orgId}/contacts`,
      contacts,
      { headers, observe: 'response' }
    );
  }
  reCodeOrganization(orgId: string, orgDetails: any) {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.put(`${this.baseUrl}org/${orgId}/geocode`, orgDetails, {
      headers,
      observe: 'response',
    });
  }
  orgFeaturedSpaceDetails(queryParams: OrgFeaturedSpaceDetailsDto) {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    const params = {
      limit: queryParams.limit.toString(),
      offset: queryParams.offset.toString(),
    };
  
    return this.http.get(`${this.baseUrl}retrieving/org/featured/space/details`, {
      headers,
      params: params,
      observe: 'response',
    });
  }
}
