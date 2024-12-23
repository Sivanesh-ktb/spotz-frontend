import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { loginRoutes } from '../models/enums';
import { ViewportScroller } from '@angular/common';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  private loggedIn = new BehaviorSubject<boolean>(false);
  private userName = new BehaviorSubject<string>('');
  private provider = new BehaviorSubject<boolean>(false);
  options: any;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private googleAuthService: SocialAuthService
  ) {
    this.options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
  }

  verifyToken() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  return this.http.get(`${this.baseUrl}user/sessionToken`, {
    headers,
    observe: 'response',
  });
  }
  resetPassword(password: string, confirmPassword: string, token: string) {
    const body = { password, confirmPassword, token };
    return this.http.post(`${this.baseUrl}reset-password`,body);
  }

  signIn(providerId: string): void {
    console.log('providerId:', providerId);
  }
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.baseUrl}login`, body, {observe:'response'});
  }
  authGoogleLogin(
    token: string,
    accessToken: string,
  ): Observable<any> {
    const body = { token, accessToken };
    return this.http.post<any>(
      `${this.baseUrl}auth/google?return=${this.baseUrl}/admin/home/dashboard`,
      body
    );
  }
  authGoogleCallback(token: any): Observable<any> {
    const body = { token };
    return this.http.post<any>(
      `${this.baseUrl}google/callback`,
      body,
      this.options
    );
  }
  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload.replace(/_/g, '/').replace(/-/g, '+'));
    const jsonPayload = JSON.parse(decodeURIComponent(escape(decodedPayload)));
    return jsonPayload;
  }
  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    dob: string
  ): Observable<any> {
    const body = { email, password, firstName, lastName, dob, phone };
    return this.http.post<any>(`${this.baseUrl}signup`, body);
  }
  forgotPassword(
    email: string,
  ) {
    const body = { email};
    return this.http.post<any>(`${this.baseUrl}forgot-password`, body);
  }

  setLoginStatus(status: boolean, name: string, provider: boolean): void {
    this.loggedIn.next(status);
    this.userName.next(name);
    this.provider.next(provider);
  }

  getLoginStatus(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUserName(): Observable<string> {
    return this.userName.asObservable();
  }
  getAuthLoginMessage(): string {
    const message = this.cookieService.get('loginMessage');
    return message ? message : '';
  }
  authLogout() {
    localStorage.clear();
    if (this.provider.getValue()) {
      this.signOut();
    }
    this.router.navigate([loginRoutes.LOGIN]);
    this.viewportScroller.scrollToPosition([0, 0]);
    this.loggedIn.next(false);
    this.userName.next('');
    this.provider.next(false);
  }
  removeSuccessMessage(): void {
    this.cookieService.remove('loginMessage');
  }
  signOut(): void {
    this.googleAuthService
      .signOut()
      .then(() => {
        console.log('User signed out from Google');
      })
      .catch((error) => {
        console.error('Error during sign-out:', error);
      });
  }
}
