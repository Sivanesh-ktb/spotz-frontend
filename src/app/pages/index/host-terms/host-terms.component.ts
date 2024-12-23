import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-host-terms',
  templateUrl: './host-terms.component.html',
  styleUrls: ['./host-terms.component.css']
})
export class HostTermsComponent {
   @Input() checkHeader!:boolean;
}
