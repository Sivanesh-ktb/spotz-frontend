import { ViewportScroller } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FileUpload } from 'primeng/fileupload';
import { AppConst } from 'src/app/app.const';
import { Helpers } from 'src/app/helpers/helper';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-basics-profile',
  templateUrl: './basics-profile.html',
  styleUrls: ['./basics-profile.css']
})
export class BasicsProfileComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  profileForm: FormGroup;
  nameInfo: string;
  affiliationInfo: string;
  descriptionInfo: string;
  addressInfo: string;
  years: number[] = [];
  months: string[] = this.appConst.months;
  days: number[] = [];
  states = this.appConst.usState;
  uploadUrl: string = this.helper.uploadImageUrl;
  profileImage = '';
  isHovered = true;
  imageUrl = '';
  userName = localStorage.getItem('name') ?? '';
  affiliationArray : any = new FormArray([]);
  constructor(
    private formBuild: FormBuilder,
    private appConst: AppConst,
    private userService: UserService,
    private toastr: ToastrService,
    private helper: Helpers,
    private viewPortScroller: ViewportScroller
  ) {
    this.nameInfo = this.appConst.nameInfo;
    this.affiliationInfo = this.appConst.affiliationInfo;
    this.descriptionInfo = this.appConst.profileDescriptionInfo;
    this.addressInfo = this.appConst.profileAddressInfo;
    this.profileForm = this.formBuild.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: [''],
      affiliation: this.affiliationArray,
      title: [''],
      street1: ['',Validators.required],
      city: ['',Validators.required],
      state: ['',Validators.required],
      zip: ['',Validators.required],
      street2: [''],
      gender: [''],
      bio: [''],
      year: ['', Validators.required],
      month: ['', Validators.required],
      day: ['', Validators.required],
      isPasswordSet: [false],
      valid: [false],
      groups: [''],
    });

    this.profileForm.get('month')?.valueChanges.subscribe(() => {
      this.updateDays();
    });
    this.profileForm.get('year')?.valueChanges.subscribe(() => {
      this.updateDays();
    });
  }

  ngOnInit(): void {
    this.getUserProfile();
    const currentYear = new Date().getFullYear() - 18;
    for (let year = currentYear; year >= currentYear - 100; year--) {
      this.years.push(year);
    }
    this.updateDays();
  }

  getUserProfile() {
    this.userService.getUserProfile().subscribe(
      (response: any) => {
        if (response.status === 200) {
          const userDetails = response.body;
          if (userDetails.assets) {
            for (const asset of userDetails.assets) {
              if (asset.current === true) {
                this.profileImage = asset.url;
                this.isHovered = false;
                break;
              }
            }
          }
          this.updateUserValues(userDetails);
        }
      }
    );
  }

  updateUserValues(userDetails: any) {
    const dob = new Date(userDetails.dob);
    const year = dob.getFullYear();
    const month = this.months[dob.getMonth()];
    const day = dob.getDate();
    this.profileForm.patchValue({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      dob: userDetails.dob,
      street1: userDetails?.address?.street1,
      street2: userDetails?.address?.street2,
      city: userDetails?.address?.city,
      state: userDetails?.address?.state,
      zip: userDetails?.address?.zip,
      gender: userDetails?.gender,
      title: userDetails?.title,
      valid: userDetails?.valid,
      isPasswordSet: userDetails?.isPasswordSet,
      groups: userDetails?.groups,
      bio: userDetails?.bio,
      month: month,
      year: year,
      day: day
    });

    this.setAffiliations(userDetails.affiliation);
  }

  setAffiliations(affiliations: string[]) {
    const affiliationArray = this.profileForm.get('affiliation') as FormArray;
    affiliations.forEach((affiliation: string) => {
      affiliationArray.push(this.formBuild.control(affiliation));
    });
  }

  updateDays() {
    let year = this.profileForm.get('year')?.value;
    let month = this.profileForm.get('month')?.value;
    if (!year && !month) {
      year = new Date().getFullYear() - 18;
      month = 'January';
    }
    if (year && month) {
      const daysInMonth = new Date(year, this.months.indexOf(month) + 1, 0).getDate();
      this.days = Array.from({ length: daysInMonth }, (v, day) => day + 1);
    }
  }
  addAffiliation() {
    this.affiliationArray.push(new FormControl(''));
  }
  dropAffiliation(index: number): void {
    this.affiliationArray.removeAt(index);
  }

  profileSubmit() {
    if (this.profileForm.valid) {
    this.profileForm.get('affiliation')?.setValue(this.affiliationArray.value);
      this.convertDateOfBirth();
      this.userService.updateUserProfile(this.profileForm.value).subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.affiliationArray.clear();
             const imageUrl = response?.body?.assets.find((asset: any) => asset.current === true)?.url;
            this.imageUrl = imageUrl;
            this.userName = response?.body?.firstName;
            localStorage.setItem('name', this.userName);
            localStorage.setItem('userImage', imageUrl);
            this.toastr.success('Profile updated successfully.');
            this.updateUserValues(response.body);
            this.viewPortScroller.scrollToPosition([0,0]);
          } else {
            this.toastr.error(response.body.message);
          }
        }
      );
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
  convertDateOfBirth() {
    const year = this.profileForm.get('year')?.value;
    const month = this.profileForm.get('month')?.value;
    const day = this.profileForm.get('day')?.value;
    const monthIndex = this.months.indexOf(month) + 1;
    const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
    const formattedDay = day < 10 ? `0${day}` : day;
    const dob = `${year}-${formattedMonth}-${formattedDay}T00:00:00.000Z`;
    this.profileForm.get('dob')?.setValue(dob);
  }

  // upload profile image
  triggerProfileFileUpload() {
    this.fileUpload.choose();
  }

  handleSpaceDropImg(event: any) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.storeProfileImages(files);
    }
  }

  handleProfileDragImg(event: any) {
    event.preventDefault();
  }
  uploadProfileImage(event: any) {
    const files: FileList = event.files;
    this.storeProfileImages(files);
  }

  storeProfileImages(files: FileList) {
    const formData: FormData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    this.userService.uploadUserProfileImages(formData).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.profileImage = response?.body?.url;
          localStorage.setItem('userImage', this.profileImage);
          this.toastr.success(`Successfully updated profile photo.`);
        } else {
          this.toastr.error('Images upload failed');
        }
      },
      (error) => {
        this.toastr.error('Images upload failed',error.message);
      }
    );
  }

  onHover(hovered: boolean): void {
    this.isHovered = hovered;
  }
}
