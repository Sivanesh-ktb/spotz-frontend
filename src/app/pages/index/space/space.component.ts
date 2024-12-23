import { Component } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.css']
})
export class SpaceComponent {
  signUpLink = this.appConst.spotz_signup_link;
  createListing = this.appConst.CREATE_LISTING;
  constructor(
    private appConst:AppConst
  ){

  }
}
