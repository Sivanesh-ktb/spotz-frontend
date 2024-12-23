import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent {
  @ViewChild('content', { static: false }) content!: ElementRef;
  constructor(
    private router: Router,
    private renderer: Renderer2
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
          if (this.content) {
            this.renderer.setProperty(this.content.nativeElement, 'scrollTop', 0);
          }
      }
    });
  }
}
