import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuardService {

  constructor(private router: Router) { }

  canActivate( ) {
    if (localStorage.getItem('role') !== environment.superAdminRole) {
      return true;
    }
    else if(localStorage.getItem('role')){
      return false;
    }
    else{
  localStorage.clear();
 this.router.navigateByUrl('/');
 return false;
    }
  }
}
