import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { CreateOrgComponentService } from "src/app/services/create-org.service";
import { Helpers } from "src/app/helpers/helper";
import { adminRoutes } from "src/app/models/enums";
import { ToastrService } from "ngx-toastr";
import { Location, ViewportScroller } from '@angular/common';
import { AppConst } from "src/app/app.const";
@Component({
  selector: 'app-create-org',
  templateUrl: './create-org.html',
  styleUrls: ['./create-org.css']
})
export class CreateOrgComponent implements OnInit {
  addNewOrg: FormGroup;
  successMessage = '';
  isLoggedIn = false;
  orgUrl = '';
  orgName = '';
  orgCity = '';
  state ='';
  sameOrgName = false;
  sameOrgCity = false;
  invalidOrgName!: boolean;
  org = '';
  orgId='';
  orgFormTitle ='';
  errorMsg = '';
  usState : string[] = [''];
  lastCheckedName  = '';
  lastCheckedCity = '';
  isChecking = false;
  isEditMode = false;
  constructor(
    private fb: FormBuilder,
    private createOrgService: CreateOrgComponentService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute,
    private helper: Helpers,
    private viewportScroller: ViewportScroller,
    private appConst : AppConst
  ) {
    this.addNewOrg = this.fb.group({
      name: ['', Validators.required],
      cat: ['', Validators.required],
      street1: ['', Validators.required],
      street2 : [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      twitter: [''],
      facebook: [''],
      linkedin: [''],
      instagram: [''],
      url: [''],
      active: [],
      paying: [],
      featured:[],
      group: [
        '',
        [
          Validators.min(0),
          Validators.max(100)
        ]
      ],
      nonGroup: [
        '',
        [
          Validators.min(0),
          Validators.max(100)
        ]
      ],
      user: [null, this.isEditMode ? [Validators.min(5), Validators.max(100)] : []],
      tx: [null, this.isEditMode ? [Validators.min(4), Validators.max(100)] : []],
      monthly:[],
      claimed:[],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.checkOrgId(this.orgId);
    });
    this.updateOrgUrl();
    this.usState = this.appConst.usState;
  }

  checkOrgId(orgId: string) {
    if (orgId) {
      this.orgFormTitle = this.helper.orgFromTitleEdit;
      this.retrieveEditOrgDetails();
      this.isEditMode = true;
    } else {
      this.orgFormTitle = this.helper.orgFromTitleCreate;
      this.addNewOrg.reset();
      this.isEditMode = false;
    }
  }
  retrieveEditOrgDetails(){
    this.orgId;
    this.createOrgService.retrieveOrgDetails(this.orgId).subscribe(
      (data : any) =>{
        if(data.status === 200){
        const response = data.body;
        this.addNewOrg.patchValue({
          name: response.name,
          cat: response.cat,
          street1: response.address?.street1 ?? '',
          street2: response.address?.street2 ?? '',
          city: response.address?.city ?? '',
          state: response.address?.state ?? '',
          zip: response.address?.zip ?? '',
          twitter: this.extractSocialHandle(response.social?.twitter),
          facebook: this.extractSocialHandle(response.social?.facebook),
          linkedin: this.extractSocialHandle(response.social?.linkedin),
          instagram: this.extractSocialHandle(response.social?.instagram),
          url: response?.url ?? '',
          active: response.active ?? 0,
          paying: response.paying ?? 0,
          featured: response.featured ?? 0,
          group: response.terms?.host?.group? 100* response.terms?.host?.group: 0,
          nonGroup: response.terms?.host?.nonGroup ? 100* response.terms?.host?.nonGroup: 0,
          user: response.terms?.user ?100 * response.terms?.user: 0,
          tx: response.terms?.tx ? 100* response.terms?.tx: 0,
          monthly: response.monthly ?? 0,
          claimed: response.claimed ?? false
        });
        this.orgName = response.shortName?? '';
        this.orgCity = response.address?.city?? '';
        this.state = response.address?.state?? '';
        this.updateOrgUrl();
      }
      else{
        this.toastr.error(data.body.message);
      }
      });

  }

extractSocialHandle(url: string): string {
    if (!url) {
      return '';
    }
    const matches =
    url.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|facebook\.com|instagram\.com|linkedin\.com)\/(.+)/);
    return matches ? matches[1] : url;
  }
  updateOrgUrl(){
    this.orgUrl =
    window.location.origin+`/`+`${this.state?this.state:'[state]'}/${this.orgCity?this.orgCity:'[city]'}/orgs/`;
  }
  organizationName(event : Event){
    const inputElement = event.target as HTMLInputElement;
    const orgNameInput = inputElement.value;

    const invalidCharactersPattern = this.appConst.ALLOWED_CHARACTERS;

    if (invalidCharactersPattern.test(orgNameInput)) {
      this.invalidOrgName = true;
      return;
    } else{
      this.invalidOrgName = false;
    }

    this.orgName = this.createOrgService.formatOrganizationName(orgNameInput);
    this.updateOrgUrl();
    this.reset()
    this.checkAndRunOrganizationDetails();
  }

  reset(){
    this.sameOrgName = false
    this.sameOrgCity = false
  }
  removePlusMinus(event: any): void {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[+-]/g, '');
  }

  checkAndRunOrganizationDetails() {
    if (this.orgName && this.orgCity) {
      if (this.isChecking) {
       return; // Prevent multiple concurrent checks
      }
      if (this.orgName === this.lastCheckedName && this.orgCity === this.lastCheckedCity) {
        return; // Prevent duplicate checks for the same inputs
      }
      this.checkOrganizationDetails();
    }
  }
  checkOrganizationDetails() {
    this.isChecking = true;
    this.lastCheckedName = this.orgName;
    this.lastCheckedCity = this.orgCity;

    this.createOrgService.getOrgbyId(this.orgName, this.orgCity, this.orgId).subscribe(
      (response : any) => {
        this.isChecking = false;

        if(response.status === 201 && response.body.message){
          this.toastr.error(response.body.message);
          this.sameOrgName = true
          this.sameOrgCity = true
        }
        else{
          this.sameOrgName = false
          this.sameOrgCity = false
        }
      },
      error => {
        this.isChecking = false;
        console.error('Error sending organization name', error);
      }
    );
  }
  organizationState(event : Event){
    this.state = (event.target as HTMLInputElement).value;
    this.updateOrgUrl();
  }
  organizationCity(event : Event){
    this.orgCity = (event.target as HTMLInputElement).value;
    this.updateOrgUrl();
    this.reset()
    this.checkAndRunOrganizationDetails()
  }
  orgAddNew() {

    if(this.orgId && this.addNewOrg.valid){
    this.createOrgService.updateOrgDetails(this.orgId,this.addNewOrg.value).subscribe(
      (response : any) => {
        if(response.status === 200 && response.body._id !== undefined){
        this.addNewOrg.reset();
        this.successMessage = 'Organization updated successfully!';
        this.toastr.success(this.successMessage)
        this.router.navigate([`admin/manage/org/${response.body._id}`]);
        return this.viewportScroller.scrollToPosition([0, 0]);
        }
        else{
          console.log('Organization update failed!');
          this.successMessage = 'Organization update failed!';
          this.toastr.error(this.successMessage);
        }
      },
      error => {
        if(error.status==401){
          this.authService.authLogout();
        }
        console.error(error);
      }
    )
    }
    else{

    if (this.addNewOrg.valid) {
      this.createOrgService.createOrg(this.addNewOrg.value).subscribe(
        (response : any) => {
          if(response._id !== undefined){
          this.addNewOrg.reset();
          this.successMessage = 'Organization created successfully!';
          this.toastr.success(this.successMessage)
          this.router.navigate([`admin/manage/org/${response._id}`]);
          this.viewportScroller.scrollToPosition([0, 0]);
          }
          else{
            console.log('Organization creation failed!');
            this.errorMsg = 'Organization creation failed!';
            this.toastr.error(this.errorMsg);
          }
        },
        error => {
          if(error.status==401){
            this.authService.authLogout();
            this.errorMsg = 'Unauthorized access! Please login to continue.';
            this.toastr.error(this.errorMsg);
          }

          console.error(error);
        }
      );
    } else {
      console.log('Form is invalid');
      this.addNewOrg.markAllAsTouched();
    }
  }
  }
    cancelOrg(){
      if(this.orgId){
        this.router.navigate([`admin/manage/org/${this.orgId}`]);
      }
      else{
       this.router.navigate([adminRoutes.ADMIN_DASHBOARD]);
      }
       return this.viewportScroller.scrollToPosition([0, 0]);
    }
    validateMonthly(event: any) {
      const input = event.target;
      const value = input.value;

      input.value = value.replace(/[^0-9.]/g, '');

      if ((input.value.match(/\./g) || []).length > 1) {
        input.value = input.value.replace(/\.+$/, '');
      }
    }
   redirectToOrgUrl(orgUrl: string, orgName: string | null) {
        const shortName = orgName ? orgName : '[short-name]';
        const fullUrl = `${orgUrl}${shortName}`;
      window.open(fullUrl, '_blank');
    }
    clearAddress(){
      this.addNewOrg.patchValue({
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: ''
      });
    }
}
