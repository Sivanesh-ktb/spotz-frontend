
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})

export class retrievingOrgDetailsService {
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }
  retrieveAllOrgDetails(date='') {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    let params = new HttpParams();
    if (date) {
       params = params.set('date', date);
    }
    return this.http.get(`${this.baseUrl}dashboard`, {
      headers: headers,
      params: params,
      observe: 'response'
    });
  }
getOrgSpaceTemplates(orgId: string){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization':`Bearer ${accessToken}`
  });
  return this.http.get(`${this.baseUrl}organizations/${orgId}`,{headers:headers,observe:'response'});
}
updateOrgSpaceTemplates(orgId: string, templateDetails: any){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization':`Bearer ${accessToken}`
  });
  return this.http.put(`${this.baseUrl}organizations/${orgId}`,templateDetails,{headers:headers,observe:'response'});
}
uploadRulesAttachments(orgId: string, files: any){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization':`Bearer ${accessToken}`
  });
  return this.http.post(`${this.baseUrl}organizations/${orgId}/files`,files,{headers:headers,observe:'response'});
}
deleteRulesAttachments(orgId: string, fileId:string){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization':`Bearer ${accessToken}`
  });
  return this.http.delete(`${this.baseUrl}organizations/${orgId}/files/${fileId}`,{headers:headers,observe:'response'});
}
}
