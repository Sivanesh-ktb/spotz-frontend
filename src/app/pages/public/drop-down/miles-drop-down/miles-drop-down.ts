import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-miles-drop-down',
  templateUrl: './miles-drop-down.html',
  styleUrls: ['./miles-drop-down.css'],
})
export class MilesDropDownComponent implements OnInit {
  @Input() page!: number;
  @Input() spaceType!: boolean;
  @Output() proximityChanged: EventEmitter<number> = new EventEmitter<number>();

  filter = {
    maxDistance: this.appConst.MAX_DISTANCE,
  };

  showFilters = false;
  hasDistances = true;
  selectedDistance: number = this.appConst.MAX_DISTANCE;

  constructor(private router: Router, private appConst: AppConst) {}

  ngOnInit(){
    this.proximityChanged.emit(this.appConst.MAX_DISTANCE);
  }

  onDistanceChanged(event: Event): void {
    // event.preventDefault();
    const target = event.target as HTMLInputElement;
    this.selectedDistance = Number(target.value);
    const selectedValue = target.value;

    this.filter.maxDistance = Number(selectedValue);
    this.proximityChanged.emit(this.filter.maxDistance);

    this.updateUrlWithDistance(Number(selectedValue));

    this.showFilters = false;
  }

  toggleFilters(val?: boolean): void {
    this.showFilters = val !== undefined ? val : !this.showFilters;
  }

  clearSpace(): void {
    this.filter.maxDistance = this.appConst.MAX_DISTANCE;
    this.proximityChanged.emit(this.filter.maxDistance);
  }

  updateUrlWithDistance(distance: number): void {
    this.router.navigate([], {
      queryParams: { proximity: distance },
      queryParamsHandling: 'merge',
    });
  }
}
