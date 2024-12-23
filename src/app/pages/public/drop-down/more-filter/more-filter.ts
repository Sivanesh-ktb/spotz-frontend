import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-more-filter',
  templateUrl: './more-filter.html',
  styleUrls: ['./more-filter.css']
})
export class MoreFilterComponent {
  @Input() page!:number;
}
