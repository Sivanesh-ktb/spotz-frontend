import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-space-types',
  templateUrl: './space-types.html',
  styleUrls: ['./space-types.css']
})
export class SpaceTypesComponent implements OnInit {
  @Input() orgSpaces: any;
  @Output() selectedSpaceTypes = new EventEmitter<any>();
  spaceIds: number[] = [];
  facilityDetails : any;
  selectedSports: string[] = [];
  ngOnInit(){
    this.facilityDetails = this.orgSpaces;
  }
  onSpaceTypeSelected(event: { spaceId: number }): void {
    this.spaceIds = [Number(event.spaceId)];
    this.applyFilters();
  }
  onSportTypeSelected(event: string[]): void {
    this.selectedSports = event;
    this.applyFilters();
  }
  applyFilters(): void {
    let filteredSpaces = this.spaceIds.length > 0 && this.spaceIds[0] !== -1
      ? this.facilityDetails.filter((space: { typ: number[]; }) =>
          space.typ.some((typId: number) => this.spaceIds.includes(typId))
        ): this.facilityDetails;
    if (this.selectedSports.length > 0) {
      filteredSpaces = filteredSpaces.filter((space: { sports: string[]; }) =>
        space.sports.some((sport: string) => this.selectedSports.includes(sport))
      );
    }
    this.orgSpaces = filteredSpaces;
    this.selectedSpaceTypes.emit(this.orgSpaces);
  }
}
