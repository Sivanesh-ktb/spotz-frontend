import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { UserService } from './services/user.service';
import { USER_ROLES } from './models/enums';
import { MatDialog } from '@angular/material/dialog';
import { UnauthorizedPopupComponent } from './pages/user/unauthorized-popup/unauthorized-popup';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router,
    private matDialog: MatDialog
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const authorizedRoles = route.data['authorizedRoles'] as string[];
    const orgId = route.params['orgId'];
    if(localStorage.getItem('role') && (localStorage.getItem('role') == USER_ROLES.superadmin)){
      return true;
    }
    else{
      const hasOrgAccess = this.userService.hasAccessToOrg(orgId, authorizedRoles);
      if (!hasOrgAccess) {
        this.matDialog.open(UnauthorizedPopupComponent,{
          width:'400px',
          position: {top: '30px'}
        });
        return false;
      }
      return true;
    }
  }
}
