
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class searchLocationService {
  private baseUrl = environment.baseUrl;
  private searchUrl = `${this.baseUrl}search/preload`;

  constructor(private http: HttpClient) { }

searchLocation(value: string) {
  const params = new HttpParams().set('query', value);
  return this.http.get(this.searchUrl, { params,observe:'response'});
}
autoCompleteAddress(address:string){
  const params = new HttpParams().set('query', address);
  return this.http.get(`${this.baseUrl}search/place/autocomplete`, { params,observe:'response'});
}
getPlaceDetails(placeId:string){
  const params = new HttpParams().set('placeId',placeId);
  return this.http.get(`${this.baseUrl}search/place/details`,{params,observe:'response'});
}
}
