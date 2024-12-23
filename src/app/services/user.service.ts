
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { USER_ROLES } from '../models/enums';


@Injectable({
  providedIn:'root'
})

export class UserService{

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient){

  }
  getUserProfile(){
    const accessToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('id')??'';
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${accessToken}`
    });
    return this.http.get(`${this.baseUrl}user/${userId}`,{headers,observe: 'response'});
  }
  updateUserProfile(userData:any){
    const accessToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('id')??'';
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${accessToken}`
    });
    const userDetails = this.userDataFormat(userData);
    return this.http.put(`${this.baseUrl}user/${userId}`,userDetails,{headers,observe: 'response'});
  }
  userDataFormat(userData:any){
    return {
      firstName : userData?.firstName,
      lastName : userData?.lastName,
      email : userData?.email,
      dob : userData?.dob,
      affiliation : userData?.affiliation,
      title : userData?.title,
      address : {
        street1 : userData?.address?.street1?? userData?.street1,
        street2 : userData?.address?.street2?? userData?.street2,
        city : userData?.address?.city?? userData?.city,
        state : userData?.address?.state?? userData?.state,
        zip : userData?.address?.zip ?? userData?.zip,
        hood : userData?.address?.hood ?? userData?.hood,
        county : userData?.address?.county ?? userData?.county,
      },
      subaccountid: userData?.subaccountid,
      isstripepayment: userData?.isstripepayment,
      assets: [
       {
        name: userData?.assets?.name,
        url: userData?.assets?.url,
        contentType : userData?.assets?.contentType,
        current: userData?.assets?.current?true : false
       }
      ],
      gender : userData?.gender,
      isPasswordSet : userData?.isPasswordSet,
      valid : userData?.valid,
      reviews : userData?.reviews,
      links : userData?.links,
      groups : userData?.groups,
      lang : userData?.lang,
      tzone : userData?.tzone,
      bio: userData?.bio,
      phon : userData?.phon,
      notifications: {
        updates: {
          email: userData?.notifications?.updates?.email?? false
        },
        reminder: {
          email:  userData?.notifications?.reminder?.email?? false
        }
    },
    }
  }
  uploadUserProfileImages(formData:FormData){
    const accessToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('id')??'';
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${accessToken}`
    });
    return this.http.post(`${this.baseUrl}user/photo/${userId}`,formData,{headers,observe: 'response'});
  }
  updatePassword(pass:string,password:string){
    const accessToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('id')??'';
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${accessToken}`
    });
    const userDetails = {
      pass : pass,
      password : password
    }
    return this.http.put(`${this.baseUrl}user/password/${userId}`,userDetails,{headers,observe: 'response'});
  }
  getUsersByUIDs(userIds:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${accessToken}`
    });
    const params = new HttpParams()
    .set('ids',userIds)
    return this.http.get(`${this.baseUrl}users`,{headers,params,observe: 'response'});
  }
  getUserMemberships(){
    const accessToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('id')??'';
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${accessToken}`
    });
    return this.http.get(`${this.baseUrl}user/memberships`,{headers,observe:'response'});
  }
  getUserPropertiesDetails(){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${accessToken}`
    });
    return this.http.get(`${this.baseUrl}user/properties`,{headers,observe:'response'});
  }
  hasAccessToOrg(orgId: string, requiredRoles: string[]): boolean {
    const groupsString = localStorage.getItem('groups');
    if (!groupsString) {
        return false;
    }
    let groups;
    try {
        groups = JSON.parse(groupsString);
    } catch (error) {
        return false;
    }
    if (!Array.isArray(groups)) {
        if(groups.name === USER_ROLES.superadmin){
          return true;
        }
        else{
        return false;
        }
    }

    const hasAccess = groups.some((group: { org: string; name: string }) =>
       group.org === orgId && requiredRoles.includes(group.name)
    );
    const checkSuperAdmin = groups.some((group: {name: string }) =>
    (group.name === USER_ROLES.superadmin));
    if(checkSuperAdmin){
      return true;
    }
    else{
      return hasAccess;
    }
}

}

