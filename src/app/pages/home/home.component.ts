
import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConst } from 'src/app/app.const';
import { AuthService } from 'src/app/services/auth.service';
import { StatusCode } from 'src/app/status-code';
@Component({
  selector: 'app-login',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sessionToken="";
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  userName = '';
  err='';
  join = '';
  listingError='';
  activated =false;
  isLoggedIn = false;
  user: any;
  loggedIn: any;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private viewPortScroller: ViewportScroller,
    private titleService: Title,
    private appConst: AppConst,
    private authService: AuthService
  ) { }
ngOnInit() : void{
    this.route.queryParams.subscribe((params) => {
  this.email = params['updatedEmail'];
  this.activated = params['activated']=== 'true';
  this.userName = params['name'] || null;
  this.join = params['join'] || null;
  this.err = params['err'] || null;
  this.listingError = params['error'] || null;
    });
    this.checkActivation();
    this.checkHomeRoute();
    this.titleService.setTitle(this.appConst.spaceListingMetaTitle);
    // this.tokenVerification();
  }

  tokenVerification(): void {
    this.authService.verifyToken().subscribe(
      (response: any) => {
        if (response.status == StatusCode.UNAUTHORIZED) {
          this.sessionToken = response;
          this.authService.authLogout();
        }
      },
      (error) => {
        if (error.status == StatusCode.UNAUTHORIZED) {
          this.authService.authLogout();
        }
      }
    );
  }

checkActivation(){
  if(this.email){
    this.toastr.success('Email updated successfully');
   }
    if(this.activated == true){
      this.toastr.success('Account activated successfully');
    }
  }
  checkHomeRoute(){
    if(this.join){
      this.toastr.success(this.userName+ ' You have joined a group successfully');
      this.router.navigate(['/']);
      return this.viewPortScroller.scrollToPosition([0,0]);
    }
    else if(this.listingError){
      this.toastr.error('Listing not available.');
      this.router.navigate(['/']);
      return this.viewPortScroller.scrollToPosition([0,0]);
    }
  }
  focusSearchBox() {
    this.viewPortScroller.scrollToPosition([100, 300]);
  }
}
