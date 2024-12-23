import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-sport-activity-drop-down',
  templateUrl: './sport-activity-drop-down.html',
  styleUrls: ['./sport-activity-drop-down.css'],
})
export class SportActivityDropDownComponent implements OnInit {
  sportEnum = this.appConst.SPORT_ENUM;
  sportDropDown: { type: string; name: string }[] = [];
  groupedSports: { [key: string]: string[] } = {};
  sportTypes: string[] = [];
  dropdownOpen = false;
  selectedSportTypes: string[] = [];
  @Output() sportTypeSelected = new EventEmitter<string[]>();
  @Input() createSpace!: boolean;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-menu') && !target.closest('.form-control')) {
      this.dropdownOpen = false;
    }
  }

  constructor(private appConst: AppConst) {}

  ngOnInit() {
    this.sportDropDown = this.sportEnum.map((sport) => ({
      type: sport.type,
      name: sport.name,
    }));
    this.sportEnum.forEach((sport) => {
      if (!this.groupedSports[sport.type]) {
        this.groupedSports[sport.type] = [];
        this.sportTypes.push(sport.type);
      }
      this.groupedSports[sport.type].push(sport.name);
    });
  }

  toggleSportType(sportType: string) {
    if (this.selectedSportTypes.includes(sportType)) {
      this.selectedSportTypes = this.selectedSportTypes.filter(
        (type) => type !== sportType
      );
    } else {
      this.selectedSportTypes.push(sportType);
    }
    this.sportTypeSelected.emit(this.selectedSportTypes);
  }

  isChecked(sportType: string) {
    return this.selectedSportTypes.includes(sportType);
  }
  handleClick(name: string, event: Event) {
    event.stopPropagation();
    this.toggleSportType(name);
  }
  clearAllSports() {
    this.selectedSportTypes = [];
    this.sportTypeSelected.emit(this.selectedSportTypes);
  }
}
