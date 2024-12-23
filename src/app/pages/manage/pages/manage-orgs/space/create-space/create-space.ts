
import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AppConst } from "src/app/app.const";
import { Helpers } from "src/app/helpers/helper";
import { SpaceService } from "src/app/services/space.service";
import { FacilityService } from "src/app/services/facility.service";

@Component({
  selector: 'app-create-space',
  templateUrl: './create-space.html',
  styleUrls: ['./create-space.css'],
})
export class CreateSpaceComponent implements OnInit {
  spaceForm: FormGroup;
  orgId = '';
  facilityId = '';
  spaceId = '';
  displayBaseName = '';
  displayNumber = '';
  displayLetter = '';
  displaySuffix = '';
  displayName = '';
  spaceType = 0;
  basicType = 'ft';
  ft = 'ft';
  yds = 'yds';
  m = 'm';
  ageGroup = this.appConst.AGE_GROUPS;
  surfaceList = this.appConst.SURFACE_ENUM;
  firstLabel = '';
  secondLabel = '';
  thirdLabel = '';
  firstOptionValue: string[] = [];
  secondOptionValue: string[] = [];
  thirdOptionValue: string[] = [];
  rental!: number;
  notifyStatus = false;
  dimensionsWith = '';
  numberInfo: string = this.appConst.spaceNumberInfo;
  spaceLetterInfo: string = this.appConst.spaceLetterInfo;
  spaceSuffixInfo: string = this.appConst.spaceSuffixInfo;
  spaceTypeInfo: string = this.appConst.spaceTypeInfo;
  spaceAreaInfo: string = this.appConst.spaceAreaInfo;
  spaceFormTitle: string = this.helper.spaceFormTitleCreate;

  groupedSports: { [key: string]: string[] } = {};
  sportEnum = this.appConst.SPORT_ENUM;
  spaceEnum = this.appConst.SPACES_ENUM;
  types: string[] = [];
  selectedNames: string[] = [];
  sportTypes: string[] = [];
  clearValue!: boolean;
  invalidSpaceName!: boolean;
  spacesName: { name: string; value: number; home: boolean; sort: number }[] =
    [];
    selectedSpaceTypeEvent!:{name:string,value:number};
  selectedSpaceName: {
    name: string;
    value: number;
    home: boolean;
    sort: number;
  }[] = [];
  rentalAmount = '';
  facName = '';
  checkboxcheck = false;
  spaceStoredDetails: any[] = [];
  dropdownOpen = false;
  selectedSpaceType = '';
  facSpaceDetails: any[] = [];
  selectedParentSpace = '';
  constructor(
    private formBuild: FormBuilder,
    private route: ActivatedRoute,
    private appConst: AppConst,
    private spaceService: SpaceService,
    private toastr: ToastrService,
    private router: Router,
    private helper: Helpers,
    private viewPortScroller: ViewportScroller,
    private facilityService: FacilityService
  ) {
    this.spaceForm = this.formBuild.group({
      base: ['', Validators.required],
      name: ['', Validators.required],
      number: [''],
      letter: [''],
      suffix: [''],
      price: ['', Validators.required],
      capacity: [null],
      surface: [''],
      m: [''],
      l: [''],
      w: [''],
      ageGroup: [''],
      indoor: [''],
      tagline: [''],
      summary: [''],
      rentaltypes: ['', Validators.required],
      instantBooking: [''],
      eventName: [''],
      notify: [''],
      typ: [''],
      sports: [''],
      spaceTypeCheckbox: [false],
      selectedSpaceType: ['', Validators.required],
      parentId: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.facilityId = paramMap.get('facilityId') ?? '';
      this.spaceId = paramMap.get('spaceId') ?? '';
      this.checkSpaceId(this.spaceId);
    });
    for (let short = 0; short < this.ageGroup.length; short++) {
      this.checkSpaceGroup(this.ageGroup[short]);
    }
    this.spaceForm.get('m')?.setValue('ft');
    this.getFacilityDetails();
  }
  checkSpaceId(spaceId: string) {
    if (spaceId) {
      this.spaceFormTitle = this.helper.spaceFormTitleEdit;
      this.retrieveEditSpaceDetails();
      this.handletypes();
      this.displayStoredDetails();
    } else {
      this.spaceFormTitle = this.helper.spaceFormTitleCreate;
      this.spaceForm.reset();
      this.handletypes();
      this.displayStoredDetails();
    }
  }
  addAndUpdateSpace() {
    this.displaySpaceBaseName();
    if (this.spaceForm.valid) {
      try {
        this.updateDisplayName();
        const selectedValues = this.selectedSpaceName.map(
          (sendingValue) => sendingValue.value
        );
        this.spaceForm.get('typ')?.setValue(selectedValues);
        this.spaceForm.get('parentId')?.setValue(this.selectedParentSpace);
        this.spaceForm.get('sports')?.setValue(this.sportTypes);
        if (this.spaceId) {
          this.spaceService
            .updateSpaceDetails(this.spaceId, this.spaceForm.value)
            .subscribe(
              (response: any) => {
                if (response.status === 200) {
                  this.toastr.success('Space updated successfully.');
                  this.router.navigate([
                    'admin/manage/org/' +
                      this.orgId +
                      '/facility/' +
                      this.facilityId +
                      '/space/' +
                      this.spaceId,
                  ]);
                  return this.viewPortScroller.scrollToPosition([0, 0]);
                } else {
                  return this.toastr.error(response.body.message);
                }
              },
              (error) => {
                console.error('Error updating space:', error);
              }
            );
        } else {
          this.spaceService
            .createSpace(this.orgId, this.facilityId, this.spaceForm.value)
            .subscribe(
              (response: any) => {
                if (response.status === 200) {
                  this.toastr.success(response.body.message);
                  this.router.navigate([
                    'admin/manage/org/' +
                      this.orgId +
                      '/facility/' +
                      this.facilityId +
                      '/space/' +
                      response.body.savedSpace._id,
                  ]);
                  return this.viewPortScroller.scrollToPosition([0, 0]);
                } else {
                  return this.toastr.error(response.body.message);
                }
              },
              (error) => {
                console.error('Error creating space:', error);
              }
            );
        }
      } catch (error) {
        console.error('Error in addAndUpdateSpace:', error);
      }
    } else {
      this.spaceForm.markAllAsTouched();
    }
  }
  cancelEdit() {
    this.spaceForm.reset();

    this.router.navigate([
      `admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/${this.spaceId}`,
    ]);
  }
  displaySpaceBaseName() {
    this.displayName =
      (this.displayBaseName ? this.displayBaseName : '') +
      ' ' +
      (this.displayNumber ? this.displayNumber : '') +
      (this.displayLetter ? this.displayLetter : '') +
      (this.displaySuffix ? this.displaySuffix : '');
    this.spaceForm.get('name')?.setValue(this.displayName);
  }
  calculateArea(): void {
    const length = this.spaceForm.get('l')?.value || 0;
    const width = this.spaceForm.get('w')?.value || 0;
    const area = length * width;
    const areaWithCommas = area.toLocaleString();
    this.dimensionsWith = `${areaWithCommas}`;
  }

  updatedDisplayName(): void {
    const base = this.spaceForm.get('base')?.value || '';
    const number = this.spaceForm.get('number')?.value || '';
    const letter = this.spaceForm.get('letter')?.value || '';
    const suffix = this.spaceForm.get('suffix')?.value || '';

    this.displayName = `${base} ${number} ${letter} ${suffix}`;
  }

  updateSpaceFormControl(controlName: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const spaceNameInput = inputElement.value;

    const invalidCharactersPattern = this.appConst.ALLOWED_CHARACTERS;

    if (invalidCharactersPattern.test(spaceNameInput)) {
      this.invalidSpaceName = true;
      return;
    } else{
      this.invalidSpaceName = false;
    }

    this.spaceForm.get(controlName)?.setValue(spaceNameInput);
    this.updatedDisplayName();
  }

  spaceBaseName(event: Event): void {
    this.updateSpaceFormControl('base', event);
  }

  spaceNumbers(event: Event): void {
    this.updateSpaceFormControl('number', event);
  }

  spaceLetter(event: Event): void {
    this.updateSpaceFormControl('letter', event);
  }

  spaceSuffix(event: Event): void {
    this.updateSpaceFormControl('suffix', event);
  }

  updateDisplayName() {
    const baseName = this.spaceForm.get('base')?.value || '';
    const number = this.spaceForm.get('number')?.value || '';
    const letter = this.spaceForm.get('letter')?.value || '';
    const suffix = this.spaceForm.get('suffix')?.value || '';

    this.displayName = `${baseName} ${number} ${letter} ${suffix}`.trim();
    this.setDisplayName();
  }

  setDisplayName() {
    this.spaceForm.get('name')?.setValue(this.displayName);
  }

  surfaceChange(event: Event) {
    console.log((event.target as HTMLInputElement).value);
  }
  onSpaceTypeChange(type: number) {
    this.spaceType = type;
  }

  checkSpaceGroup(ageGroup: any) {
    switch (ageGroup.sort) {
      case 0:
        this.firstLabel = ageGroup.type;
        this.firstOptionValue.push(ageGroup.name);
        break;
      case 1:
        this.secondLabel = ageGroup.type;
        this.secondOptionValue.push(ageGroup.name);
        break;
      case 2:
        this.thirdLabel = ageGroup.type;
        this.thirdOptionValue.push(ageGroup.name);
        break;
      default:
        break;
    }
  }
  rentalType(event: Event) {
    const type = parseInt((event.target as HTMLInputElement).value);
    this.checkRentalType(type);
  }
  checkRentalType(type: number) {
    if (type === 0) {
      this.rental = 0;
    } else if (type === 1) {
      this.rental = 1;
    }
  }
  numberFormat(event: Event, onBlur = false) {
    const rawValue = (event.target as HTMLInputElement).value;
    this.priceFormat(rawValue, onBlur);
  }
  priceFormat(rawValue: string,onBlur = false): string {
    const cleanedValue = rawValue.replace(/[^0-9.]/g, '');
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
        return '';
    }
    const parsedValue = parseFloat(cleanedValue);

    if (!isNaN(parsedValue) && parsedValue >= 0) {
      const formattedValue = onBlur
          ? parsedValue.toFixed(2) 
          : cleanedValue;
      
      this.spaceForm.get('price')?.setValue(formattedValue);
      this.rentalAmount = formattedValue;
    } else {
        this.spaceForm.get('price')?.setValue(''); 
        this.rentalAmount = '';
    }
    return this.rentalAmount
  }

  onBasicTypeChange(type: string) {
    this.basicType = type;
  }
  instantBookingChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.notifyStatus = true;
    } else {
      this.notifyStatus = false;
    }
  }
  dimensionWith(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      this.dimensionsWith = value;
    }
  }
  retrieveEditSpaceDetails() {
    try {
      this.spaceService
        .getSpaceDetails(this.spaceId)
        .subscribe((response: any) => {
          if (response.status === 200) {
            const spaceDetails = response.body;
            this.spaceStoredDetails.push(spaceDetails);
            this.updateSpaceTypes(spaceDetails.typ);
            this.displayStoredDetails();
            this.handletypes();
            this.onOptionChange(event);
            this.spaceForm.patchValue({
              base: spaceDetails?.base,
              name: spaceDetails?.name,
              number: spaceDetails?.number,
              letter: spaceDetails?.letter,
              suffix: spaceDetails?.suffix,
              price: this.priceFormat((spaceDetails?.price.toString()), true),
              surface: spaceDetails?.surface,
              m: spaceDetails?.dimension?.w?.m,
              l: spaceDetails?.dimension?.l?.v,
              w: spaceDetails?.dimension?.w?.v,
              ageGroup: spaceDetails?.ageGroup,
              indoor: spaceDetails?.indoor,
              tagline: spaceDetails?.tagline,
              summary: spaceDetails?.summary,
              rentaltypes: spaceDetails?.rentaltypes,
              instantBooking: spaceDetails?.instantBooking,
              eventName: spaceDetails?.eventName,
              notify: spaceDetails?.notify,
              typ: spaceDetails?.typ,
              sports: spaceDetails?.sports,
              spaceTypeCheckbox: spaceDetails?.typ.length > 1 ? true : false,
              selectedSpaceType :Array.isArray(spaceDetails?.typ)
              ? spaceDetails.typ.length > 1 ? 'Multiple' : spaceDetails.typ[0]
              : spaceDetails?.typ,
              parentId: spaceDetails?.parentId,
              capacity: spaceDetails?.capacity,
            });
            this.sportTypes = spaceDetails?.sports;
            this.displayName = spaceDetails.name;
            this.spaceType = spaceDetails.indoor;
            this.dimensionsWith = spaceDetails?.dimension?.w?.v;
            this.basicType = spaceDetails?.dimension?.w?.m;
            this.rentalAmount = this.priceFormat((spaceDetails?.price.toString()), true);
            this.checkRentalType(spaceDetails.rentaltypes);
            this.notifyStatus = spaceDetails?.instantBooking ?? false;
            const facUrl = spaceDetails?.fac?.gdUrl;
            this.facName = facUrl.substring(facUrl.lastIndexOf('/') + 1);
          } else {
            this.toastr.error(response.body.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  getFacilityDetails() {
    this.facilityService
      .getOneFacilityDetails(this.facilityId)
      .subscribe((response: any) => {
        if (response.status == 200) {
          this.facSpaceDetails.push(response.body.spaces);
        } else {
          this.toastr.error(response.body.message);
        }
      });
  }
  handletypes() {
    this.spaceEnum.forEach((spaces) => {
      this.spacesName.push(spaces);
    });
  }

  onOptionChange(event: any) {
    const selectedValue = Number(event.target.value);
    this.updateSpaceTypes(selectedValue);

    if (this.selectedSpaceName.length > 1) {
      this.checkboxcheck = true;
    }
  }
  updateSpaceTypes(selectedValue: number) {
    if (!isNaN(selectedValue)) {
      const matchedEnum = this.spaceEnum.find(
        (item) => item.value === selectedValue
      );
      if (matchedEnum) {
        if (this.checkboxcheck) {
          const index = this.selectedSpaceName.findIndex(
            (item) => item.value === selectedValue
          );
          if (index === -1) {
            this.selectedSpaceName.push(matchedEnum);
          } else {
            this.selectedSpaceName.splice(index, 1);
          }
        } else {
          this.selectedSpaceName = [matchedEnum];
        }
        this.displaySpaceType();
      }
    }
  }

  displayStoredDetails() {
    this.selectedSpaceName = [];
    this.spaceStoredDetails.forEach((values) => {
      const typValues = Array.isArray(values.typ) ? values.typ : [values.typ];
      typValues.forEach((typValue: number) => {
        const matchedEnum = this.spaceEnum.find(
          (item) => item.value === typValue
        );
        if (
          matchedEnum &&
          !this.selectedSpaceName.find((item) => item.value === typValue)
        ) {
          this.selectedSpaceName.push(matchedEnum);
        }
      });
    });
    this.displaySpaceType();
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.checkboxcheck = true;
    } else {
      this.selectedSpaceName = [];
      this.checkboxcheck = false;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  clearSpaceSelection() {
    this.selectedSpaceName = [];
    this.selectedSpaceTypeEvent= { name : '',value:0};
    this.checkboxcheck = false;
    this.spaceForm.controls['spaceTypeCheckbox'].setValue(false);
  }

  onSportTypeSelected(sportType: string[]): void {
    this.sportTypes = sportType;
  }

  clearSportSection() {
    this.sportTypes.length = 0;
  }

  getParentSpace(event: any) {
    this.selectedParentSpace = event.target.value;
  }

  displaySpaceType(){
    if(this.selectedSpaceName.length > 1){
      this.selectedSpaceTypeEvent= { name : this.appConst.multiSelect,value:0};
    }
    else if(this.selectedSpaceName && this.selectedSpaceName.length==1){
      this.selectedSpaceTypeEvent={name: this.selectedSpaceName[0].name, value: this.selectedSpaceName[0].value};
    }
  }

  getSpaceColor(type: number): string {
    return this.appConst.SPACE_COLORS[type] || '#747474';
  }
}
