import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-space-type-drop-down',
  templateUrl: './space-type-drop-down.html',
  styleUrls: ['./space-type-drop-down.css']
})
export class SpaceTypeDropDownComponent implements OnChanges, OnInit {
  dropdownOpen = false;
  @Input() clearValue !: boolean;
  @Input() spaceDetails: any;
  @Input() allTypes = false;
  @Output() spaceTypeSelected = new EventEmitter<{ spaceId: number[], name: string[] }>();
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-menu') && !target.closest('.form-control')) {
      this.dropdownOpen = false;
    }
  }
  orgId = '';
  facId = '';
  spaceId = '';
  selectedSpaceTypes: number[] = [];
   spaceTypes:any;
  spaceEnum = this.appConst.SPACES_ENUM;
  OrgSpaceTypes: { name: string; value: number; home: boolean; sort: number }[] = [];
  selectedSpaceNames: string[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orgId = params.get('orgId') ?? '';
      this.facId = params.get('facilityId') ?? '';
      this.spaceId = params.get('spaceId') ?? '';
      if (this.orgId) {
        this.getSpaceDetails();
      }
    });
  }
  ngOnChanges(): void {
    if(this.clearValue && this.allTypes){
      this.OrgSpaceTypes = [...this.spaceEnum];
      this.selectedSpaceTypes = [];
      this.selectedSpaceNames = [];
    }
   else if (this.clearValue) {
      this.selectedSpaceTypes = [];
      this.selectedSpaceNames = [];
      this.spaceTypeSelected.emit({spaceId:[],name:[]});
      this.OrgSpaceTypes = [];
    } else {
      this.getSpaceDetails();
    }
  }
  constructor(
    private route: ActivatedRoute,
    private appConst: AppConst
  ) { }

  getSpaceDetails() {
    this.OrgSpaceTypes = [];
    if (this.allTypes) {
      this.OrgSpaceTypes = [...this.spaceEnum];
    } else {
      if(this.spaceDetails && this.spaceDetails?.length > 0){
      this.spaceTypes = [...new Set(this.spaceDetails.reduce((type: number[], space: { typ: number[] }) => {
        if (space.typ) {
          type.push(...space.typ);
        }
        return type;
      }, []))];

      this.spaceTypes.forEach((type: number) => {
        const foundSpaceType = this.spaceEnum.find((space: { value: number }) => space.value === type);
        if (foundSpaceType) {
          this.OrgSpaceTypes.push(foundSpaceType);
        }
      });
    }
    }
  }

  toggleSpaceType(spaceId: number, index: number, name: string): void {
    if (!this.spaceTypes) {
        this.spaceTypes = [];
    }

    const selectedIndex = this.selectedSpaceTypes.indexOf(spaceId);

    if (selectedIndex > -1) {
        // Remove the existing selected space
        this.selectedSpaceTypes.splice(selectedIndex, 1);
        this.selectedSpaceNames.splice(selectedIndex, 1);
        this.spaceTypes.splice(selectedIndex, 1);
    } else {
        // Add the new selected space
        this.selectedSpaceTypes.push(spaceId);
        this.selectedSpaceNames.push(name);
        this.spaceTypes.push(index);
    }

    // Emit the updated space IDs and names
    this.spaceTypeSelected.emit({
      spaceId: this.selectedSpaceTypes,
      name: this.selectedSpaceNames
    });
  }

  isChecked(index: number): boolean {
    return this.selectedSpaceTypes.includes(index);
  }
  reset() {
    this.spaceTypeSelected.emit({spaceId:[],name:[]});
    this.OrgSpaceTypes = [];
  }
  clearAllSpaceTypes(): void {
    this.selectedSpaceTypes = [];
    this.selectedSpaceNames = [];
    this.spaceTypeSelected.emit({spaceId:[],name:[]});
  }
}
