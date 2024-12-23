import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConst } from 'src/app/app.const';
import { LoginComponent } from '../../auth/login/login.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpLink = ''

  constructor(
    private appConst : AppConst,
    private dialog: MatDialog,
    private viewPortScroller: ViewportScroller
  ){


  }
  ngOnInit(){
    this.signUpLink = this.appConst.spotz_signup_link
  }
  viewSpaceListing(){
    window.open(this.appConst.HOW_IT_WORKS, '_blank');
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  openSignInDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '500px',
      disableClose: false,
      data: { showSignup: false }
    });
  }
}
