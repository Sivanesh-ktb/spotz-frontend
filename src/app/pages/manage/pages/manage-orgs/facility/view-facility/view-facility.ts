import { ViewportScroller } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FileUpload } from "primeng/fileupload";
import { AppConst } from "src/app/app.const";
import { Helpers } from "src/app/helpers/helper";
import { FacilityService } from "src/app/services/facility.service";
import { GeneralHoursComponent } from "./general-hours/general-hours";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-view-facility',
  templateUrl: './view-facility.html',
  styleUrls: ['./view-facility.css', '../../../../../../../assets/css/manage-org-common.css'],

})
export class ViewFacilityComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  orgDetailsForFac: any;
  orgId = "";
  imageId = '';
  type = 0;
  fileUploadProfile: any;
  uploadUrl = "";
  facilityId = "";
  facilityDetails: any = {};
  facilityTypeName = "";
  amenitiesList: string[] = [];
  filterText = '';
  spaceDetails = [];
  filteredSpaces: any[] = [];
  spaceInfo : string = this.appConst.facSpaceInfo;
  orgTagInfo : string = this.appConst.orgTagInfo;
  page = 1;
  generalInfo = false;
  pageSize = 10;
  totalItems = 0;
  pagedOrgDetails: any[] = [];
  orgLogo = '';
  hours: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private helper: Helpers,
    private facilityService: FacilityService,
    private viewportScroller: ViewportScroller,
    private appConst: AppConst,
    private dialog: MatDialog,
  ) {

    this.amenitiesList = this.appConst.facilityAmenity;
  }
sortOrder: 'asc' | 'desc' = 'asc';
ngOnInit() : void {
  this.uploadUrl = this.helper.uploadImageUrl;
  this.route.paramMap.subscribe(paramMap =>{
    this.orgId = paramMap.get('orgId') ?? '';
    if( paramMap.get('facilityId')){
      this.facilityId = paramMap.get('facilityId') ?? '';
      this.getFacilityDetails();
    }
  });
}
  editFacility() {
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/edit/${this.facilityId}`]);
    return this.viewportScroller.scrollToPosition([0, 0]);
  }

  getFacilityDetails() {
    this.facilityService.getOneFacilityDetails(this.facilityId).subscribe(
      (response: any) => {
        if(response.status == 200){
        this.orgDetailsForFac = response.body.org;
        this.orgLogo = this.orgDetailsForFac?.banner;
        this.facilityDetails = response.body;
        this.filteredSpaces = this.facilityDetails.spaces;
        this.pagedOrgDetails = this.filteredSpaces;
          this.hours = response.body.hours?.map((hour: any) => ({
            days: Array.isArray(hour.days) ? hour.days : [hour.days],
            start: hour.start || '',
            end: hour.end || '',
          })) || [];
        this.totalItems = this.filteredSpaces.length
        if (this.facilityDetails.indoor == 0) {
          this.facilityTypeName = "Indoor";
        } else if (this.facilityDetails.indoor == 1) {
          this.facilityTypeName = "Outdoor";
        } else if (this.facilityDetails.indoor == 2) {
          this.facilityTypeName = "Indoor / Outdoor";
        }
      }
      else{
        this.toastr.error(response.body.message);
      }
      }
    )
  }

  formatDays(days: string[]): string {
    const dayMap: { [key: string]: string } = {
      'Monday': 'M',
      'Tuesday': 'T',
      'Wednesday': 'W',
      'Thursday': 'Th',
      'Friday': 'F',
      'Saturday': 'S',
      'Sunday': 'Su'
    };

    return days.map(day => dayMap[day]).join('-');
  }

  formatTime(time: string): string {
    if (!time) return '';

    const [hour, minutesAndPeriod] = time.split(':');
    const [minutes, period] = minutesAndPeriod.split(' ');
    let formattedHours = parseInt(hour, 10);
    if (formattedHours === 12) {
      formattedHours = 12;
    } else if (formattedHours > 12) {
      formattedHours -= 12;
    }
    return `${formattedHours}:${minutes} ${period}`;
  }


  isAmenityAvailable(amenity: string): boolean {
    return this.facilityDetails && this.facilityDetails.amenity && this.facilityDetails.amenity.includes(amenity);
  }

  viewOrganization() {
    return this.router.navigate([`/admin/manage/org/${this.orgId}`]);
  }

  // upload banner image
  handleFacilityDropBannerImg(event: DragEvent) {
    this.handleDrop(event);
  }

  handleFacilityDragOverBannerImg(event: DragEvent) {
    event.preventDefault();
  }

  onBasicUploadFacilityAutoBanner(event: any) {
    this.storeBackgroundImage(event.files);
  }

  triggerFacilityFileUpload() {
    if (this.fileUpload) {
      this.fileUpload.choose();
    } else {
      console.error('fileUpload is not defined');
    }
  }

  // upload profile image
  handleDragOverProfileImg(event: DragEvent) {
    event.preventDefault();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.storeBackgroundImage(files);
    }
  }

  storeBackgroundImage(files: FileList) {
    const key = 'banner';
    this.facilityService.uploadFacilityBackgroundImage(this.facilityId,files,this.orgId,key).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.facilityDetails.banner = response.body.url;
          this.toastr.success(response.body.message);
        } else {
          this.toastr.error(response.body.message);
        }
      },
      (error) => {
        console.error(error);
        this.toastr.success(error.message);
      }
    );
  }
  addNewSpace(): void{
    if(this.orgId && this.facilityId){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/new`]);
    return this.viewportScroller.scrollToPosition([0, 0]);
    }
  }
  viewSpace(spaceId: string): void{
    if(this.orgId && this.facilityId){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/${spaceId}`]);
    return this.viewportScroller.scrollToPosition([0, 0]);
    }
  }
  filterSpaces() {
    if (this.filterText.trim() === '') {
      this.pagedOrgDetails = this.facilityDetails.spaces;
    } else {
      this.pagedOrgDetails = this.facilityDetails.spaces.filter((space: any) =>
        space.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }
  }
  viewSpaceList(){
    if(this.orgId && this.facilityId){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/spaces`]);
    return this.viewportScroller.scrollToPosition([0, 0]);
    }
  }
  viewTagOrganization(){
    if(this.orgId){
    this.router.navigate([`admin/manage/org/${this.orgId}/settings`]);
    return this.viewportScroller.scrollToPosition([0, 0]);
    }
  }
  addGeneralHours() {
    this.getFacilityDetails();

    const dialogRef = this.dialog.open(GeneralHoursComponent, {
      width: '700px',
      data: { orgId: this.orgId, facId: this.facilityId, hours: this.hours }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.getFacilityDetails();
      }
    });
  }

  onSelectedPagination(pagedData: any[]): void {
    this.pagedOrgDetails = pagedData;
  }
  getSpaceColor(type: number): string {
    return this.appConst.SPACE_COLORS[type] || '#747474';
  }
  viewSpaceName(type: number): string | undefined {
    const foundSpace = this.appConst.SPACES_ENUM.find((space) => space.value === type);
    return foundSpace ? foundSpace.name : undefined;
  }
  viewSchedule(spaceId: string){
    if(this.orgId && this.facilityId && spaceId){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/${spaceId}/calendar`]);
    return this.viewportScroller.scrollToPosition([0, 0]);
    }
  }
  showHelp(){
    this.generalInfo = !this.generalInfo;
   }
   toggleHelp(){
    this.generalInfo = !this.generalInfo;
   }
   toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortSpaces();
  }
  sortSpaces() {
    this.pagedOrgDetails.sort((dataFormatA, dataFormatB) => {
      const dataA = JSON.stringify(dataFormatA).toLowerCase();
      const dataB = JSON.stringify(dataFormatB).toLowerCase();
      if (this.sortOrder === 'asc') {
        return dataA.localeCompare(dataB);
      } else {
        return dataB.localeCompare(dataA);
      }
    });
  }
}
