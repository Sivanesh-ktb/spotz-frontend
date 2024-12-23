import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hoursly-rental',
  templateUrl: './hoursly-rental.component.html',
  styleUrls: ['./hoursly-rental.component.css']
})
export class HourslyRentalComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  waiver() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/forms/waiver'], { relativeTo: this.route })
    );
    window.open(url, '_blank');
  }
}
