
import { ViewportScroller } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AppConst } from "src/app/app.const";
import { Helpers } from "src/app/helpers/helper";
import { loginRoutes } from "src/app/models/enums";
import { AuthService } from "src/app/services/auth.service";
import { FacilityService } from "src/app/services/facility.service";
import { ManageOrgService } from "src/app/services/manage-org.service";

@Component({
  selector: 'app-create-facility',
  templateUrl: './create-facility.html',
  styleUrls: ['./create-facility.css'],
})
export class CreateFacilityComponent implements OnInit {
  @ViewChild('facilityNameField') facilityNameField!: ElementRef;
  facilityForm: FormGroup;
  orgId = '';
  facFormTitle = '';
  orgDetails: any;
  usState: string[] = [];
  facilityAmenity: string[] = [];
  same = false;
  facilityUrl = '';
  facilityName = '';
  facName="";
  facilityType = 0;
  invalidFacName!: boolean;
  amenities = false;
  facilityId = '';
  href = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private manageOrgService: ManageOrgService,
    private appConst: AppConst,
    private fb: FormBuilder,
    private facilityService: FacilityService,
    private toastr: ToastrService,
    private helper: Helpers,
    private viewportScroller: ViewportScroller,
    private authService: AuthService
  ) {
    this.facilityForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      abbr: [''],
      amenities: this.fb.array([]),
      showAvailability: [''],
      street1: ['', Validators.required],
      street2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      indoor: [''],
      href: [''],
      amenitiesValue: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    this.usState = this.appConst.usState;
    this.facilityAmenity = this.appConst.facilityAmenity;
    this.amenities;
    this.route.paramMap.subscribe((paramMap) => {
      this.facilityId = paramMap.get('facilityId') ?? '';
      this.orgId = paramMap.get('orgId') ?? '';
      this.checkFacilityId(this.facilityId);
      this.viewOrgDetails();
    });
  }
  viewOrgDetails() {
    this.manageOrgService.getViewOrgDetails(this.orgId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.orgDetails = response.body;
          this.updateOrgUrl();
        } else {
          this.toastr.error(response.body.message);
        }
      },
      (error) => {
        if (error.status === 401) {
          this.authService.authLogout();
          this.router.navigate([loginRoutes.LOGIN]);
        } else {
          this.toastr.error(error.message);
        }
      }
    );
  }
  checkFacilityId(facilityId: string) {
    if (facilityId) {
      this.facFormTitle = this.helper.facFromTitleEdit;
      this.retrieveEditFacDetails();
      this.viewOrgDetails();
    } else {
      this.facFormTitle = this.helper.facFromTitleCreate;
      this.facilityForm.reset();
    }
  }
  retrieveEditFacDetails() {
    this.facilityService
      .getOneFacilityDetails(this.facilityId)
      .subscribe((data: any) => {
        if (data.status === 200) {
          const response = data.body;
          this.facilityForm.patchValue({
            name: response.name ?? '',
            description: response.description ?? '',
            abbr: response.abbr ?? '',
            street1: response.address?.street1 ?? '',
            street2: response.address?.street2 ?? '',
            city: response.address?.city ?? '',
            state: response.address?.state ?? '',
            zip: response.address?.zip ?? '',
            indoor: response.indoor ?? 0,
            showAvailability: response.showAvailability,
            href: response.href,
          });
          this.facilityName = response.name;
          this.updateAmenitiesValue(response);
        } else {
          this.toastr.error(data.body.message);
        }
      });
  }
  updateAmenitiesValue(response: any) {
    // Clear current amenities FormArray
    const amenitiesArray = this.facilityForm.get('amenities') as FormArray;
    while (amenitiesArray.length) {
      amenitiesArray.removeAt(0);
    }
    // Populate the amenities FormArray with new values
    if (response.amenity) {
      response.amenity.forEach((amenity: string) => {
        amenitiesArray.push(this.fb.control(amenity));
      });
    }
    if (response.indoor == 0) {
      this.facilityType = 1;
      this.amenities = true;
    } else if (response.indoor == 1) {
      this.facilityType = 2;
      this.amenities = true;
    } else if (response.indoor == 2) {
      this.facilityType = 3;
      this.amenities = true;
    }
  }
  isAmenityChecked(amenity: string): boolean {
    const amenitiesArray = this.facilityForm.get('amenities') as FormArray;
    return amenitiesArray.controls.some((control) => control.value === amenity);
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.same = true;
      this.facilityForm.patchValue({
        street1: this.orgDetails?.address?.street1,
        street2: this.orgDetails?.address?.street2,
        city: this.orgDetails?.address?.city,
        state: this.orgDetails?.address?.state,
        zip: this.orgDetails?.address?.zip,
      });
    } else {
      this.clearAddress();
    }
  }
  clearAddress() {
    this.facilityForm.patchValue({
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    });
  }
  updateOrgUrl() {
    this.facilityUrl =
      window.location.origin +
      `/` +
      `${
        this.orgDetails.address.state
          ? this.orgDetails.address.state
          : '[state]'
      }/${
        this.orgDetails.address.city ? this.orgDetails.address.city : '[city]'
      }/org/`;
  }
  getFacilityName(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const facNameInput = inputElement.value;

    const invalidCharactersPattern =  this.appConst.ALLOWED_CHARACTERS;

    if (invalidCharactersPattern.test(facNameInput)) {
      this.invalidFacName = true;
      return;
    } else{
      this.invalidFacName = false;
    }
     this.facName = facNameInput;
    this.facilityName = this.facilityService.formatFacilityName(facNameInput);
    this.updateOrgUrl();
  }
  addAndUpdateFacility() {
    if (this.facilityForm.invalid) {
      this.scrollToFirstInvalidField();
      this.facilityForm.markAllAsTouched();
    } else {
      if (this.facilityId) {
        this.updateFacility();
      } else if (this.facilityForm.valid) {
        this.createFacility();
      } else {
        this.facilityForm.markAllAsTouched();
      }
    }
  }
  scrollToFirstInvalidField() {
    const firstInvalidControl: HTMLElement = document.querySelector(
      '.ng-invalid[formControlName]'
    ) as HTMLElement;
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      firstInvalidControl.focus();
    }
  }
  createFacility() {
    this.facilityService
      .createFacility(this.orgId, this.facilityForm.value)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.toastr.success('Save Success' + ' ' + response.body.name);
          this.router.navigate([
            `admin/manage/org/${this.orgId}/facility/${response.body._id}`,
          ]);

          return this.viewportScroller.scrollToPosition([0, 0]);
        } else {
          this.toastr.error(response.body.message);
        }
      });
  }
  updateFacility() {
    this.facilityService
      .updateFacilityDetails(
        this.orgId,
        this.facilityId,
        this.facilityForm.value
      )
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.toastr.success('Update Success' + ' ' + response.body.name);
          this.router.navigate([
            `admin/manage/org/${this.orgId}/facility/${this.facilityId}`,
          ]);

          return this.viewportScroller.scrollToPosition([0, 0]);
        } else {
          this.toastr.error(response.body.message);
        }
      });
  }
  onFacilityTypeChange(type: number) {
    this.facilityType = type;
    this.amenities = true;
  }
  shouldDisableCheckbox(index: number): boolean {
    if (this.facilityType === 1) {
      return this.facilityType === 1 && (index === 5 || index === 8);
    } else if (this.facilityType === 2) {
      return this.facilityType === 2 && (index === 0 || index === 1);
    } else {
      return false;
    }
  }
  onAmenitiesChange(event: any) {
    const amenities: FormArray = this.facilityForm.get(
      'amenities'
    ) as FormArray;

    if (event.target.checked) {
      amenities.push(this.fb.control(event.target.value));
    } else {
      const index = amenities.controls.findIndex(
        (x) => x.value === event.target.value
      );
      if (index !== -1) {
        amenities.removeAt(index);
      }
    }
  }
  cancel() {
    if(this.facilityId){
      this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}`]);
      return this.viewportScroller.scrollToPosition([0, 0]);
    }
    else{
    this.router.navigate([`admin/manage/org/${this.orgId}/facs`]);
    return this.viewportScroller.scrollToPosition([0, 0]);
    }
  }
}
