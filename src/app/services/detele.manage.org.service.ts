
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})

export class deleteManageOrg{
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient){

  }

spaceDepositDetailsDelete(spaceId:string, depositId:string){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders
  ({
    'Authorization': `Bearer ${accessToken}`
  });
  return this.http.delete(`${this.baseUrl}spaces/${spaceId}/deposits/${depositId}`,{headers,observe:'response'});
}

deleteSpaceImages(spaceId : string, imageIds: string[]) {
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
  });
  const body = { keys: imageIds }; // Wrap the keys array in an object
  return this.http.delete(`${this.baseUrl}spaces/${spaceId}/photos` ,{body: body,headers,observe:'response'});
}


deleteOrgManage(orgId: string, facId?: string, spaceId?: string) {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    if (spaceId) {
        const body = {
        facId: facId
      };
      return this.http.delete(`${this.baseUrl}spaces/${spaceId}`, { body: body, headers: headers, observe: 'response' });
    } else if (facId) {
         const body = {
        orgId: orgId,
        facId:facId,
        spaceId: spaceId
      };
      return this.http.delete(`${this.baseUrl}facility/${facId}`, { body: body, headers: headers, observe: 'response' });
    } else if (orgId) {
      const body = {
        orgId: orgId
      };
      return this.http.delete(`${this.baseUrl}organizations/${orgId}`, { body: body, headers: headers, observe: 'response' });
    } else {
     return new Observable(observer => {
        observer.error('No valid IDs provided for deletion.');
        observer.complete();
      });
    }
  }


}
