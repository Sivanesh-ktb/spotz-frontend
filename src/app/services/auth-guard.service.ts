import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  private superAdmin = new BehaviorSubject<boolean>(false);
  superAdmin$ = this.superAdmin.asObservable();
  constructor(private router: Router) { }

  canActivate() {
   if(localStorage.getItem('role') && (localStorage.getItem('role') != environment.superAdminRole)){
      return true;
    }
    else{
	    localStorage.clear();
	    this.router.navigateByUrl('/');
	    return false;
    }
  }
  loginUserRole(){
    if (localStorage.getItem('role') == environment.superAdminRole) {
      this.superAdmin.next(true);
    }
  }
}
