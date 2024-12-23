import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { adminRoutes, loginRoutes } from 'src/app/models/enums';
import { ManageOrgService } from 'src/app/services/manage-org.service';
import { FileUpload } from 'primeng/fileupload';
import { ToastrService } from "ngx-toastr";
import { Helpers } from 'src/app/helpers/helper';
import { ViewportScroller } from '@angular/common';
import { AppConst } from 'src/app/app.const';
import { CreateOrgComponentService } from 'src/app/services/create-org.service';
import { AuthService } from 'src/app/services/auth.service';
import { address } from 'src/app/models/space';
import { OrcfileDTO, ViewModel } from 'src/app/models/org';

@Component({
  selector: 'app-org-view',
  templateUrl: './org-view.html',
  styleUrls: ['./org-view.css',
    '../../../../../../../assets/css/manage-org-common.css',
  ]
})
export class OrgViewComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @ViewChild('fileUploadProfile') fileUploadProfile!: FileUpload;
  @ViewChild('fileUploadTrustLogo') fileUploadTrustLogo!: FileUpload;
  loadingprofile = false;
  loadingbanner = false;
  pagedOrgDetails: any[] = [];
  bannerImage = '';
  orgId = "";
  orgDetails: any;
  uploadUrl  ="";
  type = 0;
  imageId = '';
  viewOrg=true;
  key = '';
  filterText = '';
  filteredFacility : any[] = [];
  orgFacilityInfo: string = this.appConst.orgFacilityInfo;
  editOrgDescription   = false;
  orgDescription = '';
  totalItems = 0;
  pageSize = 10;
  page = 1;
  file: OrcfileDTO[] = [];
  vm: ViewModel;

  constructor (
    private manageOrgService : ManageOrgService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private helper : Helpers,
    private viewPortScroller: ViewportScroller,
    private appConst : AppConst,
    private createOrgService : CreateOrgComponentService,
    private authService: AuthService
  ) {
    this.vm = {
      embed: {
        color: false,
        bgcolor: '',
        button: false,
        btncolor: '',
        display: 'button',
        code: '',
        url: '',
        height: 50,
      },
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params =>{
      this.orgId = params.get('orgId')??'';
      if(this.orgId){
        this.viewOrgDetails();
      } else {
        this.router.navigate([adminRoutes.ADMIN_DASHBOARD]);
      }
    });
    this.uploadUrl = this.helper.uploadImageUrl;

  }

  viewOrgDetails() {
    this.manageOrgService.getViewOrgDetails(this.orgId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.orgDetails = response.body;
          this.orgDescription = this.orgDetails?.description;
          this.filteredFacility = this.orgDetails?.facilities;
          this.totalItems = this.filteredFacility.length;
          this.pagedOrgDetails = this.orgDetails.facilities.slice(0, this.pageSize);
          this.file = response.body.files?.map((files: any) => ({
            name: Array.isArray(files.name) ? files.name : [files.name],
            description: files.description || '',
          })) || [];
        } else {
          this.toastr.error(response.body.message);
        }
      },
      (error) => {
        if(error.status === 401){
          this.authService.authLogout();
          this.router.navigate([loginRoutes.LOGIN]);
        }
        else{
          this.router.navigate([adminRoutes.ADMIN_DASHBOARD]);
        }
      }
    );
  }

  updateEmbed() {
    let url =window.location.origin;
    url += `/admin/widget/org/${this.orgDetails._id}`;
    
    if (this.vm.embed.color && this.vm.embed.bgcolor) {
      url += `&bgcolor=${this.vm.embed.bgcolor}`;
    }
    if (this.vm.embed.button && this.vm.embed.btncolor) {
      url += `&btncolor=${this.vm.embed.btncolor}`;
    }
    let height;
    if (this.vm.embed.display === 'calendar') {
      url += '&mode=calendar';
      height = 15;
    } else if (this.vm.embed.display === 'button') {
      url += '&mode=button';
      height = 15;
    }
    else{
      height = 10;
    }
    const code = `<iframe id="spotz-widget" frameborder="0" width="240" height="${height}" src="${url}"></iframe>`;
  
    this.vm.embed.code = code;
    this.vm.embed.url = url;
    this.vm.embed.height = height;
  }
  

  editOrganization() {
    this.router.navigate([`admin/orgs/edit/${this.orgId}`]);
  }
  getDomain(url: string): string {
    const matches = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
    return matches ? matches[1] : url;
  }
 // upload banner image
  handleDropBannerImg(event: DragEvent){
    this.type = 1; // 1 for banner image
    this.key ='banner';
    this.handleDrop(event,this.type,this.key);
  }
  handleDragOverBannerImg(event: DragEvent){
    event.preventDefault();
  }
  onBasicUploadAutoBanner(event: any) {
    this.type = 1;
    this.key ='banner';
    this.storeBackgroundImage(event.files,this.type,this.key);
  }
  triggerFileUpload() {
    if (this.fileUpload) {
      this.fileUpload.choose();
    } else {
      console.error('fileUpload is not defined');
    }
  }
  triggerFileTrustLogo(){
    if (this.fileUploadTrustLogo) {
      this.fileUploadTrustLogo.choose();
    } else {
      console.error('fileUploadTrustLogo is not defined');
    }

  }
  handleDropTrustImg(event: DragEvent){
    this.type = 3; // 1 for banner image
    this.key ='Trust';
    this.handleDrop(event,this.type,this.key);
  }
  handleDragOverTrustImg(event: DragEvent){
    event.preventDefault();
  }
  onBasicUploadTrust(event: any) {
    this.type = 3;
    this.key = 'Trust';
    this.storeBackgroundImage(event.files, this.type, this.key);
  }
// upload profile image
handleDragOverProfileImg(event: DragEvent){
  event.preventDefault();
}
handleDropProfileImg(event: DragEvent){
  this.type = 2; // 2 for profile image
  this.key ='logo';
  this.handleDrop(event,this.type,this.key);
}
onBasicUploadProfile(event: any) {
  this.type = 2;
  this.key ='logo';
  this.storeBackgroundImage(event.files,this.type,this.key);
}

triggerFileUploadProfile() {
  if (this.fileUploadProfile) {
    this.fileUploadProfile.choose();
  } else {
    console.error('fileUploadProfile is not defined');
  }
}
  handleDrop(event: DragEvent,type : number,key : string ){
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.storeBackgroundImage(files,type,key);
    }
  }

  storeBackgroundImage(files: FileList,type : number,key : string) {
    if (type === this.appConst.bannerLoader) {
      this.loadingbanner = true;
  } else if (type === this.appConst.profileLoader) {
      this.loadingprofile = true;
  }
    this.manageOrgService.uploadOrgBackgroundImage(this.orgId,type, files,key).subscribe(
        (response: any) => {
          if(response.type == this.appConst.bannerLoader){
          this.orgDetails.banner = response.url;
          this.imageId = "bannerImage";
          this.setBackgroundImage(response.url,this.imageId);
          this.loadingbanner = false;
          }
          else if(response.type == this.appConst.profileLoader){
            this.orgDetails.logo = response.url;
             this.imageId = "profileImage";
             this.setBackgroundImage(response.url,this.imageId);
             this.loadingprofile = false;
          }
          else if(response.type == 3){
            this.orgDetails.trust = response.url;
          }
            this.toastr.success(response.message);
            this.cdr.detectChanges();
        },
        (error) => {
            console.error(error);
            this.toastr.success(error.message);
        }
    );
}
setBackgroundImage(imageUrl: string,id:string) {
  const dropBgElement = document.getElementById(id);
  if(dropBgElement) {
    dropBgElement.style.backgroundImage = `url(${imageUrl})`;
    dropBgElement.style.backgroundSize = 'cover';
    dropBgElement.style.backgroundPosition = 'center';
  }
}

viewOrgSettings(): void {
  if (this.orgId) {
    this.router.navigate([`/admin/manage/org/${this.orgId}/settings`]);
    this.viewPortScroller.scrollToPosition([0, 0]);
  }
}

viewFacilityList() {
  this.router.navigate([`admin/manage/org/${this.orgId}/facs`]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
addNewFacility(){
this.router.navigate([`admin/manage/org/${this.orgId}/facility/new`]);
return this.viewPortScroller.scrollToPosition([0,0]);
}
viewFacility(facId: string){
  this.router.navigate([`admin/manage/org/${this.orgId}/facility/${facId}`]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
filterFacility(){
  if (this.filterText.trim() === '') {
    this.filteredFacility = this.orgDetails.facilities;
  } else {
    this.filteredFacility = this.orgDetails.facilities.filter((fac: any) =>
      fac.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }
}
viewContactInformation(){
  this.router.navigate([`admin/manage/org/${this.orgId}/contacts`]);
  return this.viewPortScroller.scrollToPosition([0,0]);
}
saveOrgDescription(editOrgDescription: string){
  this.orgDetails.description = editOrgDescription;
  const userId = localStorage.getItem('id') ?? '';
  this.orgDetails.userId = userId;
  this.createOrgService.updateOrganizationDetails(this.orgId,this.orgDetails).subscribe(
    (response : any) => {
      if(response.status === 200 && response.body._id !== undefined){
        this.editOrgDescription = false;
        this.viewOrgDetails();
        this.toastr.success('Organization description updated successfully!');
      }
      else{
        this.toastr.error('Organization description update failed!');
      }
    },
    (error) => {
      console.error(error);
      this.toastr.error('Organization description update failed!');
    }
  );
}
recode(){
  this.manageOrgService.reCodeOrganization(this.orgId,this.orgDetails).subscribe(
    (response : any) => {
      if(response.status === 200){
        this.toastr.success('Organization recoded successfully!');
      }
      else{
        this.toastr.error('Organization recode failed!');
      }
    },
    (error) => {
      console.error(error);
      this.toastr.error('Organization recode failed!');
    }
  );
}

onSelectedPagination(pagedData: any[]): void {
  this.pagedOrgDetails = pagedData;
}

showUploadInfo = false;

onHover(isHovered: boolean) {
  this.showUploadInfo = isHovered;
}

viewOrganization(address: address, orgName: string){
  if (address && orgName) {
    const url = `/${address.state}/${address.city}/orgs/${orgName}`;
    const newTab = window.open(url, '_blank');
    if (newTab) {
      newTab.onload = function () {
        newTab.scrollTo(0, 0);
      };
    }
  }
}
}
