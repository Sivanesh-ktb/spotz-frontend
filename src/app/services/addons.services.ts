import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Helpers } from '../helpers/helper';
import { addonsData } from '../models/addons';
import { Observable } from 'rxjs';

@Injectable({
     providedIn: 'root'
})
export class createAddons{
    private baseUrl = environment.baseUrl;
    constructor(private http: HttpClient,
      private helpers: Helpers,
    ) {
    }

    formatAddonsData(addonDetails: addonsData){
        const addonsData = {
            _id: addonDetails._id,
            name: addonDetails.name,
            description: addonDetails.description,
            indoor: addonDetails.indoor,
            selected: addonDetails.selected,
            quantity: addonDetails.quantity,
            price: addonDetails.price,
            basis: addonDetails.basis,
            category: addonDetails.category,
            inactive: addonDetails.inactive,
            typ:addonDetails.typ
        }

        return addonsData
    }


    createAddons(addonDetails: addonsData) {
        const accessToken = localStorage.getItem('authToken');
       const formData = this.formatAddonsData(addonDetails);
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`
        });

        return this.http.post(`${this.baseUrl}addons`, formData,{ headers,observe:'response' });
      }

    getAllAddons(): Observable<any> {
        const accessToken = localStorage.getItem('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`
        });
        return this.http.get(`${this.baseUrl}addons`, { headers,observe:'response' });
      }

    updateAddons(id: string, addonData: any) {
      const accessToken = localStorage.getItem('authToken');
      const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
      });
  
      return this.http.put(`${this.baseUrl}addons/${id}`, addonData, { headers,observe:'response'});
  }

  deleteAddons(id: string) {
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    });

    return this.http.delete(`${this.baseUrl}addons/${id}`, { headers,observe:'response'});
}

  

}
