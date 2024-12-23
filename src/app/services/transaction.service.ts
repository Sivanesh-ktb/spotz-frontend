import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
private baseUrl = environment.baseUrl;
  constructor(
private http: HttpClient
  ) { }

  getTransactionsDetails(orgId: string,cardType:string,cardholderName:string,last4:string,startDate: string,endDate:string){
  const accessToken = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${accessToken}`
  });
  let params = new HttpParams();
  params = params.append('cardType',cardType);
  params = params.append('cardholderName',cardholderName);
  params = params.append('last4',last4);
  params = params.append('startDate',startDate);
  params = params.append('endDate', endDate);
  return this.http.get(`${this.baseUrl}finance/${orgId}/transactions`,
    {headers,params,observe:'response'});
  }
  retrievingTransactionDetails(startDate: string,endDate:string){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${accessToken}`
    });
    let params = new HttpParams();
    params = params.append('startDate',startDate);
    params = params.append('endDate',endDate);
    return this.http.get(`${this.baseUrl}user/transactions`,{headers,params,observe:'response'});
  }
  retrievingPaymentMethods(){
    const accessToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${accessToken}`
    });
    return this.http.get(`${this.baseUrl}user/payments`,{headers,observe:'response'});
  }
}
