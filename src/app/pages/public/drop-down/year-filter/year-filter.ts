import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-year-filter',
  templateUrl: './year-filter.html',
  styleUrls: ['./year-filter.css']
})
export class YearFilterComponent {
  @Input() page!:number;
}
