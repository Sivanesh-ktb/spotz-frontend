import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../auth/login/login.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  @Input() staticPage !:number;
  userName = 'User';
  currentRoute=0;
  @Input() page !:number;
  logo = this.appConst.logo_url;
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private viewPortScroller: ViewportScroller,
    private appConst: AppConst
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.checkCurrentRouteUrl(event.urlAfterRedirects);
         }
    });
  }
  openSignInDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '400px',
      disableClose: false,
      data: { showSignup: true }
    });
  }

  ngOnInit(): void {
    console.log('-------- staticPage --------', this.staticPage);
    console.log('-------- page --------', this.page);
    this.authService.getLoginStatus().subscribe(status => {
      this.isLoggedIn = status;
    });
    this.authService.getUserName().subscribe(name => {
      this.userName = name;
    });
    const userName = localStorage.getItem('name') ?? '';
    const email = localStorage.getItem('email') ?? '';
    if (userName && email) {
      this.isLoggedIn = true;
      this.userName = userName;
    }
    else{
      this.isLoggedIn = false;
    }

    this.route.queryParams.subscribe((params) => {
      const reset = params['reset'];
      if (reset === 'true' ) {
        this.openSignInDialog();
      }});
}
viewHomePage(){
  this.router.navigate(['/']);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
checkCurrentRouteUrl(url:string){
  if(url.includes('search')){
    return this.page = 1;
  }
return this.page = 0;
}
viewHowItWorks(){
  window.open(this.appConst.HOW_IT_WORKS, '_blank');
  return this.viewPortScroller.scrollToPosition([0,0]);
}
viewSpaceListing(){
  window.open(this.appConst.spotz_signup_link, '_blank');
  return this.viewPortScroller.scrollToPosition([0,0]);
}
}
