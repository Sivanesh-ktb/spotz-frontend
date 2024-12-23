import { Component, ViewEncapsulation, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-google-auto-complete',
  templateUrl: './google-auto-complete.html',
  styleUrls: ['./google-auto-complete.css'],
  encapsulation: ViewEncapsulation.None,
})
export class GoogleAutoCompleteComponent implements AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  autocomplete: google.maps.places.Autocomplete | null = null;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    if (typeof google === 'undefined' || !google.maps) {
      console.log('Google Maps API is not loaded.');
      return;
    }
    const input = this.elementRef.nativeElement.querySelector('#search');
    this.autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['address'],
      componentRestrictions: { country: 'us' }
    });

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (place?.geometry) {
        console.log('Place details:', place);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
