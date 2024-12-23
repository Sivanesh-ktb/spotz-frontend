import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  instagramLink = ''
  faceBookLink = ''
  twitterLink = ''
  linkedInLink = ''
  supportLink= this.appConst.support_link;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private appConst : AppConst

  ) {

  }
  ngOnInit(): void {
    this.instagramLink = this.appConst.spotz_instagram_link;
    this.faceBookLink = this.appConst.spotz_facebook_link;
    this.twitterLink = this.appConst.spotz_twitter_link;
    this.linkedInLink = this.appConst.spotz_linkedIn_link;

  }

  terms() {
    // this.router.navigate(['/terms']);
    window.open('/terms', '_blank');
    return this.viewportScroller.scrollToPosition([0, 0]);
  }

  privacy() {
    // this.router.navigate(['/privacy']);
    window.open('/privacy', '_blank');
    return this.viewportScroller.scrollToPosition([0, 0]);
  }

  hostTerms() {
    // this.router.navigate(['/host']);
    window.open('/host', '_blank');
    return this.viewportScroller.scrollToPosition([0, 0]);
  }

  hourslyTerms() {
    // this.router.navigate(['/hoursly']);
    window.open('/hoursly', '_blank');
    return this.viewportScroller.scrollToPosition([0, 0]);
  }
}
