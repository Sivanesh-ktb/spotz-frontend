import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-public-space-types',
  templateUrl: './space-types.html',
  styleUrls: ['./space-types.css'],
})
export class SpaceTypesDropDownComponent implements OnInit {
  @Input() page!: number;
  @Input() orgSpaces: any;
  @Output() spaceTypeSelected = new EventEmitter<{ spaceId: number }>();
  @Output() spaceTypeValueSelected = new EventEmitter<string>();
  spaceTypes: any;
  spaceEnum = this.appConst.SPACES_ENUM;
  selectedSpaceTypes: number[] = [];
  selectedSpaceNames: string[] = [];
  OrgSpaceTypes: {
    name: string;
    value: number;
    home: boolean;
    sort: number;
  }[] = [];
  constructor(private appConst: AppConst, private router: Router) {}
  ngOnInit() {
    this.getSpaceType();
  }
  getSpaceType() {
    console.log(this.orgSpaces, 'orgSpaces');

    if (this.orgSpaces && this.orgSpaces?.length > 0) {
      console.log(this.orgSpaces, 'orgSpaces');

      this.spaceTypes = [
        ...new Set(
          this.orgSpaces.reduce((type: number[], space: { typ: number[] }) => {
            if (space.typ) {
              type.push(...space.typ);
            }
            return type;
          }, [])
        ),
      ];

      this.spaceTypes.forEach((type: number) => {
        const foundSpaceType = this.spaceEnum.find(
          (space: { value: number }) => space.value === type
        );
        if (foundSpaceType) {
          this.OrgSpaceTypes.push(foundSpaceType);
        }
      });
    } else {
      this.OrgSpaceTypes = [...this.spaceEnum];
    }
  }
  onSpaceTypeChange(event: any): void {
    const selectedValue = event.target.value;
    this.spaceTypeSelected.emit({
      spaceId: selectedValue,
    });

     const selectedSpaceType = this.spaceEnum.find(
       (space) => space.value === +selectedValue
     );

    this.spaceTypeValueSelected.emit(selectedSpaceType?.name);
  }
}
